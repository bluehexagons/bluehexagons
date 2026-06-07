package main

import (
	"bytes"
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"image"
	"image/color"
	"image/png"
	"io"
	"log/slog"
	"mime/multipart"
	"net/http"
	"net/http/cookiejar"
	"net/http/httptest"
	"path/filepath"
	"strconv"
	"testing"
	"time"

	"bluehexagons.com/server/internal/auth"
	"bluehexagons.com/server/internal/config"
	"bluehexagons.com/server/internal/db"
	"bluehexagons.com/server/internal/payment"
)

// fakeGateway records the params it receives and returns a canned session,
// so checkout can be tested without touching the network.
type fakeGateway struct{ last payment.CheckoutParams }

func (f *fakeGateway) Configured() bool { return true }
func (f *fakeGateway) CreateCheckoutSession(_ context.Context, p payment.CheckoutParams) (*payment.CheckoutSession, error) {
	f.last = p
	return &payment.CheckoutSession{ID: "cs_test_123", URL: "https://stripe.test/c/cs_test_123"}, nil
}

func TestShopFlow(t *testing.T) {
	database, err := db.Open(filepath.Join(t.TempDir(), "test.db"))
	if err != nil {
		t.Fatalf("open db: %v", err)
	}
	defer database.Close()

	// Seed one product at a known price; the client never sends prices.
	const priceCents = 1999
	if _, err := database.Exec(
		`INSERT INTO products (sku, name, price_cents, currency) VALUES ('p1','Key',?, 'usd')`,
		priceCents); err != nil {
		t.Fatalf("seed: %v", err)
	}

	cfg := config.Config{
		FrontendOrigin:      "http://front.test",
		StripeSecretKey:     "sk_test",
		StripeWebhookSecret: "whsec_test",
		CookieSecure:        false,
	}
	gw := &fakeGateway{}
	srv := httptest.NewServer(newRouter(database, cfg, slog.New(slog.NewTextHandler(io.Discard, nil)), gw))
	defer srv.Close()

	jar, _ := cookiejar.New(nil)
	client := &http.Client{Jar: jar}

	do := func(method, path, body string) (*http.Response, []byte) {
		t.Helper()
		req, err := http.NewRequest(method, srv.URL+path, bytes.NewBufferString(body))
		if err != nil {
			t.Fatalf("request: %v", err)
		}
		if method == http.MethodPost {
			req.Header.Set("Origin", cfg.FrontendOrigin)
		}
		if body != "" {
			req.Header.Set("Content-Type", "application/json")
		}
		resp, err := client.Do(req)
		if err != nil {
			t.Fatalf("do %s %s: %v", method, path, err)
		}
		data, _ := io.ReadAll(resp.Body)
		resp.Body.Close()
		return resp, data
	}

	// --- account lifecycle ---
	if resp, body := do(http.MethodPost, "/api/register", `{"email":"a@b.com","password":"hunter2pass"}`); resp.StatusCode != 200 {
		t.Fatalf("register: status %d body %s", resp.StatusCode, body)
	}
	if resp, _ := do(http.MethodGet, "/api/me", ""); resp.StatusCode != 200 {
		t.Fatalf("me after register: status %d", resp.StatusCode)
	}

	// --- checkout: unknown product is rejected ---
	if resp, _ := do(http.MethodPost, "/api/checkout", `{"items":[{"product_id":999,"quantity":1}]}`); resp.StatusCode != 400 {
		t.Fatalf("checkout unknown product: want 400, got %d", resp.StatusCode)
	}
	if resp, _ := do(http.MethodPost, "/api/checkout", `{"items":[{"product_id":1,"quantity":1},{"product_id":1,"quantity":1}]}`); resp.StatusCode != 400 {
		t.Fatalf("checkout duplicate product: want 400, got %d", resp.StatusCode)
	}

	// --- checkout: valid, quantity 2 ---
	resp, body := do(http.MethodPost, "/api/checkout", `{"items":[{"product_id":1,"quantity":2}]}`)
	if resp.StatusCode != 200 {
		t.Fatalf("checkout: status %d body %s", resp.StatusCode, body)
	}
	var co struct {
		OrderID     int64  `json:"order_id"`
		CheckoutURL string `json:"checkout_url"`
	}
	if err := json.Unmarshal(body, &co); err != nil {
		t.Fatalf("decode checkout: %v", err)
	}
	if co.CheckoutURL == "" || co.OrderID == 0 {
		t.Fatalf("checkout response missing fields: %s", body)
	}

	// Price sent to Stripe must come from the DB, not the client.
	if len(gw.last.LineItems) != 1 || gw.last.LineItems[0].AmountCents != priceCents {
		t.Fatalf("gateway got wrong amount: %+v", gw.last.LineItems)
	}
	// Order persisted as pending with the correct total (price * qty).
	if got := orderStatus(t, database, co.OrderID); got != "pending" {
		t.Fatalf("order status before payment = %q, want pending", got)
	}
	if got := orderTotal(t, database, co.OrderID); got != priceCents*2 {
		t.Fatalf("order total = %d, want %d", got, priceCents*2)
	}

	// --- webhook fulfillment + idempotency ---
	eventPayload := func(eventID string, orderID int64, sessionID string, amount int, currency string) string {
		return fmt.Sprintf(`{"id":"%s","type":"checkout.session.completed","data":{"object":`+
			`{"id":"%s","client_reference_id":"%d","payment_status":"paid","amount_total":%d,"currency":"%s"}}}`,
			eventID, sessionID, orderID, amount, currency)
	}

	postWebhook := func(event string) int {
		req, _ := http.NewRequest(http.MethodPost, srv.URL+"/api/webhooks/stripe", bytes.NewBufferString(event))
		req.Header.Set("Stripe-Signature", signStripe(cfg.StripeWebhookSecret, time.Now(), []byte(event)))
		resp, err := client.Do(req)
		if err != nil {
			t.Fatalf("webhook: %v", err)
		}
		resp.Body.Close()
		return resp.StatusCode
	}

	badSession := eventPayload("evt_bad_session", co.OrderID, "cs_test_other", priceCents*2, "usd")
	if code := postWebhook(badSession); code != 500 {
		t.Fatalf("webhook wrong session: want 500, got %d", code)
	}
	badAmount := eventPayload("evt_bad_amount", co.OrderID, "cs_test_123", priceCents, "usd")
	if code := postWebhook(badAmount); code != 500 {
		t.Fatalf("webhook wrong amount: want 500, got %d", code)
	}
	if got := orderStatus(t, database, co.OrderID); got != "pending" {
		t.Fatalf("order status after bad webhook = %q, want pending", got)
	}

	event := eventPayload("evt_1", co.OrderID, "cs_test_123", priceCents*2, "usd")
	if code := postWebhook(event); code != 200 {
		t.Fatalf("webhook: status %d", code)
	}
	if got := orderStatus(t, database, co.OrderID); got != "paid" {
		t.Fatalf("order status after webhook = %q, want paid", got)
	}
	// Redelivery of the same event must not reprocess.
	if code := postWebhook(event); code != 200 {
		t.Fatalf("webhook redelivery: status %d", code)
	}
	var events int
	if err := database.QueryRow(`SELECT COUNT(*) FROM processed_events`).Scan(&events); err != nil {
		t.Fatalf("count events: %v", err)
	}
	if events != 1 {
		t.Fatalf("processed_events = %d, want 1 (idempotent)", events)
	}

	// --- logout ends the session ---
	if resp, _ := do(http.MethodPost, "/api/logout", ""); resp.StatusCode != 200 {
		t.Fatalf("logout: status %d", resp.StatusCode)
	}
	if resp, _ := do(http.MethodGet, "/api/me", ""); resp.StatusCode != 401 {
		t.Fatalf("me after logout: want 401, got %d", resp.StatusCode)
	}
}

func TestAdminDigitalDeliveryFlow(t *testing.T) {
	database, err := db.Open(filepath.Join(t.TempDir(), "test.db"))
	if err != nil {
		t.Fatalf("open db: %v", err)
	}
	defer database.Close()

	cfg := config.Config{
		FrontendOrigin:      "http://front.test",
		StripeSecretKey:     "sk_test",
		StripeWebhookSecret: "whsec_test",
		AdminEmails:         map[string]struct{}{"admin@example.com": {}},
		UploadDir:           filepath.Join(t.TempDir(), "uploads"),
		CookieSecure:        false,
	}
	gw := &fakeGateway{}
	srv := httptest.NewServer(newRouter(database, cfg, slog.New(slog.NewTextHandler(io.Discard, nil)), gw))
	defer srv.Close()

	newClient := func() *http.Client {
		jar, _ := cookiejar.New(nil)
		return &http.Client{Jar: jar}
	}
	adminClient := newClient()
	buyerClient := newClient()

	do := func(client *http.Client, method, path, contentType string, body io.Reader) (*http.Response, []byte) {
		t.Helper()
		req, err := http.NewRequest(method, srv.URL+path, body)
		if err != nil {
			t.Fatalf("request: %v", err)
		}
		if method == http.MethodPost || method == http.MethodPatch || method == http.MethodDelete {
			req.Header.Set("Origin", cfg.FrontendOrigin)
		}
		if contentType != "" {
			req.Header.Set("Content-Type", contentType)
		}
		resp, err := client.Do(req)
		if err != nil {
			t.Fatalf("do %s %s: %v", method, path, err)
		}
		data, _ := io.ReadAll(resp.Body)
		resp.Body.Close()
		return resp, data
	}
	jsonDo := func(client *http.Client, method, path, body string) (*http.Response, []byte) {
		t.Helper()
		return do(client, method, path, "application/json", bytes.NewBufferString(body))
	}

	if resp, body := jsonDo(adminClient, http.MethodPost, "/api/register", `{"email":"admin@example.com","password":"hunter2pass"}`); resp.StatusCode != 200 {
		t.Fatalf("admin register: status %d body %s", resp.StatusCode, body)
	}

	var product struct {
		ID               int64  `json:"id"`
		Title            string `json:"title"`
		PostPurchaseText string `json:"post_purchase_text"`
		KeyStats         struct {
			Total     int64 `json:"total"`
			Remaining int64 `json:"remaining"`
			Claimed   int64 `json:"claimed"`
		} `json:"key_stats"`
		Previews []struct {
			ID  int64  `json:"id"`
			URL string `json:"url"`
		} `json:"previews"`
		Downloads []struct {
			ID  int64  `json:"id"`
			URL string `json:"url"`
		} `json:"downloads"`
		Keys []struct {
			ID                 int64  `json:"id"`
			KeyText            string `json:"key_text"`
			ClaimedOrderItemID *int64 `json:"claimed_order_item_id"`
			ClaimedUserEmail   string `json:"claimed_user_email"`
		} `json:"keys"`
	}
	resp, body := jsonDo(adminClient, http.MethodPost, "/api/admin/products", `{
		"sku":"antistatic-steam",
		"title":"Antistatic Steam Key",
		"description":"A Steam key for Antistatic.",
		"price_cents":1999,
		"currency":"usd",
		"kind":"digital",
		"post_purchase_text":"Thanks for supporting Antistatic. Claim the key when you are ready.",
		"active":true
	}`)
	if resp.StatusCode != http.StatusCreated {
		t.Fatalf("create product: status %d body %s", resp.StatusCode, body)
	}
	if err := json.Unmarshal(body, &product); err != nil {
		t.Fatalf("decode product: %v", err)
	}
	if product.ID == 0 || product.Title != "Antistatic Steam Key" || product.PostPurchaseText == "" {
		t.Fatalf("bad product response: %s", body)
	}

	upload := func(role, filename, contents string) []byte {
		t.Helper()
		var buf bytes.Buffer
		mw := multipart.NewWriter(&buf)
		if err := mw.WriteField("role", role); err != nil {
			t.Fatalf("write role: %v", err)
		}
		part, err := mw.CreateFormFile("file", filename)
		if err != nil {
			t.Fatalf("form file: %v", err)
		}
		if _, err := part.Write([]byte(contents)); err != nil {
			t.Fatalf("write file: %v", err)
		}
		if err := mw.Close(); err != nil {
			t.Fatalf("close multipart: %v", err)
		}
		resp, body := do(adminClient, http.MethodPost, fmt.Sprintf("/api/admin/products/%d/assets", product.ID), mw.FormDataContentType(), &buf)
		if resp.StatusCode != http.StatusCreated {
			t.Fatalf("upload %s: status %d body %s", role, resp.StatusCode, body)
		}
		return body
	}
	upload("preview", "cover.png", "not really a png")
	upload("download", "bonus.txt", "download payload")

	resp, body = jsonDo(adminClient, http.MethodPost, fmt.Sprintf("/api/admin/products/%d/keys", product.ID), `{"text":"KEY-ONE\nKEY-TWO"}`)
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("add keys: status %d body %s", resp.StatusCode, body)
	}
	if err := json.Unmarshal(body, &product); err != nil {
		t.Fatalf("decode keys product: %v", err)
	}
	if product.KeyStats.Total != 2 || product.KeyStats.Remaining != 2 || len(product.Keys) != 2 {
		t.Fatalf("key stats after add = %+v len %d body %s", product.KeyStats, len(product.Keys), body)
	}

	if resp, body := jsonDo(buyerClient, http.MethodPost, "/api/register", `{"email":"buyer@example.com","password":"hunter2pass"}`); resp.StatusCode != 200 {
		t.Fatalf("buyer register: status %d body %s", resp.StatusCode, body)
	}
	if resp, _ := do(buyerClient, http.MethodGet, "/api/admin/products", "", nil); resp.StatusCode != http.StatusForbidden {
		t.Fatalf("buyer admin list: want 403, got %d", resp.StatusCode)
	}

	resp, body = jsonDo(buyerClient, http.MethodPost, "/api/checkout", fmt.Sprintf(`{"items":[{"product_id":%d,"quantity":1}]}`, product.ID))
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("checkout: status %d body %s", resp.StatusCode, body)
	}
	var co struct {
		OrderID int64 `json:"order_id"`
	}
	if err := json.Unmarshal(body, &co); err != nil {
		t.Fatalf("decode checkout: %v", err)
	}

	event := fmt.Sprintf(`{"id":"evt_delivery","type":"checkout.session.completed","data":{"object":`+
		`{"id":"cs_test_123","client_reference_id":"%d","payment_status":"paid","amount_total":1999,"currency":"usd"}}}`,
		co.OrderID)
	req, _ := http.NewRequest(http.MethodPost, srv.URL+"/api/webhooks/stripe", bytes.NewBufferString(event))
	req.Header.Set("Stripe-Signature", signStripe(cfg.StripeWebhookSecret, time.Now(), []byte(event)))
	webhookResp, err := buyerClient.Do(req)
	if err != nil {
		t.Fatalf("webhook: %v", err)
	}
	webhookResp.Body.Close()
	if webhookResp.StatusCode != http.StatusOK {
		t.Fatalf("webhook status = %d", webhookResp.StatusCode)
	}

	resp, body = do(buyerClient, http.MethodGet, fmt.Sprintf("/api/orders/%d/deliverables", co.OrderID), "", nil)
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("deliverables: status %d body %s", resp.StatusCode, body)
	}
	var delivery struct {
		Status string `json:"status"`
		Items  []struct {
			OrderItemID      int64  `json:"order_item_id"`
			PostPurchaseText string `json:"post_purchase_text"`
			Downloads        []struct {
				URL string `json:"url"`
			} `json:"downloads"`
			Keys struct {
				Total     int64 `json:"total"`
				Remaining int64 `json:"remaining"`
				Claimable int64 `json:"claimable"`
			} `json:"keys"`
		} `json:"items"`
	}
	if err := json.Unmarshal(body, &delivery); err != nil {
		t.Fatalf("decode deliverables: %v", err)
	}
	if delivery.Status != "paid" || len(delivery.Items) != 1 || delivery.Items[0].PostPurchaseText == "" {
		t.Fatalf("bad deliverables: %s", body)
	}
	if len(delivery.Items[0].Downloads) != 1 || delivery.Items[0].Keys.Total != 2 || delivery.Items[0].Keys.Claimable != 1 {
		t.Fatalf("bad delivery assets/keys: %s", body)
	}

	resp, body = do(buyerClient, http.MethodGet, delivery.Items[0].Downloads[0].URL, "", nil)
	if resp.StatusCode != http.StatusOK || string(body) != "download payload" {
		t.Fatalf("download: status %d body %q", resp.StatusCode, body)
	}

	resp, body = do(buyerClient, http.MethodPost, fmt.Sprintf("/api/order-items/%d/claim-key", delivery.Items[0].OrderItemID), "", nil)
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("claim key: status %d body %s", resp.StatusCode, body)
	}
	var claim struct {
		KeyText string `json:"key_text"`
	}
	if err := json.Unmarshal(body, &claim); err != nil {
		t.Fatalf("decode claim: %v", err)
	}
	if claim.KeyText != "KEY-ONE" {
		t.Fatalf("claimed key = %q, want KEY-ONE", claim.KeyText)
	}
	if resp, _ := do(buyerClient, http.MethodPost, fmt.Sprintf("/api/order-items/%d/claim-key", delivery.Items[0].OrderItemID), "", nil); resp.StatusCode != http.StatusConflict {
		t.Fatalf("second claim: want 409, got %d", resp.StatusCode)
	}

	resp, body = do(adminClient, http.MethodGet, fmt.Sprintf("/api/admin/products/%d", product.ID), "", nil)
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("admin get after claim: status %d body %s", resp.StatusCode, body)
	}
	if err := json.Unmarshal(body, &product); err != nil {
		t.Fatalf("decode product after claim: %v", err)
	}
	if product.KeyStats.Claimed != 1 || product.KeyStats.Remaining != 1 {
		t.Fatalf("key stats after claim = %+v", product.KeyStats)
	}
	if product.Keys[1].ClaimedOrderItemID == nil || product.Keys[1].ClaimedUserEmail != "buyer@example.com" {
		t.Fatalf("admin key redemption missing: %+v", product.Keys)
	}
}

func TestPrimaryAdminGrantFlows(t *testing.T) {
	t.Run("existing user granted on setup", func(t *testing.T) {
		database, err := db.Open(filepath.Join(t.TempDir(), "test.db"))
		if err != nil {
			t.Fatalf("open db: %v", err)
		}
		defer database.Close()

		hash, err := auth.HashPassword("hunter2pass")
		if err != nil {
			t.Fatalf("hash: %v", err)
		}
		if _, err := database.Exec(
			`INSERT INTO users (email, password_hash, created_at) VALUES ('owner@example.com', ?, ?)`,
			hash, time.Now().Unix()); err != nil {
			t.Fatalf("seed owner: %v", err)
		}

		cfg := config.Config{FrontendOrigin: "http://front.test", PrimaryAdminEmail: "owner@example.com", CookieSecure: false}
		srv := httptest.NewServer(newRouter(database, cfg, slog.New(slog.NewTextHandler(io.Discard, nil)), &fakeGateway{}))
		defer srv.Close()

		jar, _ := cookiejar.New(nil)
		client := &http.Client{Jar: jar}
		do := func(method, path, body string) (*http.Response, []byte) {
			t.Helper()
			req, err := http.NewRequest(method, srv.URL+path, bytes.NewBufferString(body))
			if err != nil {
				t.Fatalf("request: %v", err)
			}
			if method == http.MethodPost {
				req.Header.Set("Origin", cfg.FrontendOrigin)
			}
			if body != "" {
				req.Header.Set("Content-Type", "application/json")
			}
			resp, err := client.Do(req)
			if err != nil {
				t.Fatalf("do %s %s: %v", method, path, err)
			}
			data, _ := io.ReadAll(resp.Body)
			resp.Body.Close()
			return resp, data
		}

		if resp, body := do(http.MethodPost, "/api/login", `{"email":"owner@example.com","password":"hunter2pass"}`); resp.StatusCode != http.StatusOK {
			t.Fatalf("login owner: status %d body %s", resp.StatusCode, body)
		}
		resp, body := do(http.MethodGet, "/api/me", "")
		if resp.StatusCode != http.StatusOK {
			t.Fatalf("me owner: status %d body %s", resp.StatusCode, body)
		}
		var me struct {
			IsAdmin bool `json:"is_admin"`
		}
		if err := json.Unmarshal(body, &me); err != nil {
			t.Fatalf("decode me: %v", err)
		}
		if !me.IsAdmin {
			t.Fatalf("owner was not marked admin: %s", body)
		}
		if resp, body := do(http.MethodGet, "/api/admin/products", ""); resp.StatusCode != http.StatusOK {
			t.Fatalf("admin products: status %d body %s", resp.StatusCode, body)
		}
	})

	t.Run("future signup granted immediately", func(t *testing.T) {
		database, err := db.Open(filepath.Join(t.TempDir(), "test.db"))
		if err != nil {
			t.Fatalf("open db: %v", err)
		}
		defer database.Close()

		cfg := config.Config{FrontendOrigin: "http://front.test", PrimaryAdminEmail: "future@example.com", CookieSecure: false}
		srv := httptest.NewServer(newRouter(database, cfg, slog.New(slog.NewTextHandler(io.Discard, nil)), &fakeGateway{}))
		defer srv.Close()

		jar, _ := cookiejar.New(nil)
		client := &http.Client{Jar: jar}
		do := func(method, path, body string) (*http.Response, []byte) {
			t.Helper()
			req, err := http.NewRequest(method, srv.URL+path, bytes.NewBufferString(body))
			if err != nil {
				t.Fatalf("request: %v", err)
			}
			if method == http.MethodPost {
				req.Header.Set("Origin", cfg.FrontendOrigin)
			}
			if body != "" {
				req.Header.Set("Content-Type", "application/json")
			}
			resp, err := client.Do(req)
			if err != nil {
				t.Fatalf("do %s %s: %v", method, path, err)
			}
			data, _ := io.ReadAll(resp.Body)
			resp.Body.Close()
			return resp, data
		}

		resp, body := do(http.MethodPost, "/api/register", `{"email":"future@example.com","password":"hunter2pass"}`)
		if resp.StatusCode != http.StatusOK {
			t.Fatalf("register future admin: status %d body %s", resp.StatusCode, body)
		}
		var me struct {
			IsAdmin bool `json:"is_admin"`
		}
		if err := json.Unmarshal(body, &me); err != nil {
			t.Fatalf("decode register: %v", err)
		}
		if !me.IsAdmin {
			t.Fatalf("registered primary admin was not marked admin: %s", body)
		}
		if resp, body := do(http.MethodGet, "/api/admin/products", ""); resp.StatusCode != http.StatusOK {
			t.Fatalf("admin products after register: status %d body %s", resp.StatusCode, body)
		}
	})
}

func TestLinkedAssetFlow(t *testing.T) {
	var linkedPNG bytes.Buffer
	img := image.NewRGBA(image.Rect(0, 0, 24, 16))
	for y := 0; y < 16; y++ {
		for x := 0; x < 24; x++ {
			img.Set(x, y, color.RGBA{R: uint8(10 * x), G: uint8(12 * y), B: 180, A: 255})
		}
	}
	if err := png.Encode(&linkedPNG, img); err != nil {
		t.Fatalf("encode png: %v", err)
	}
	linkedSrv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case "/cover.png":
			w.Header().Set("Content-Type", "image/png")
			w.WriteHeader(http.StatusOK)
			if r.Method != http.MethodHead {
				_, _ = w.Write(linkedPNG.Bytes())
			}
		case "/download.zip":
			w.Header().Set("Content-Type", "application/zip")
			w.Header().Set("Content-Length", strconv.Itoa(len("remote download")))
			w.WriteHeader(http.StatusOK)
			if r.Method != http.MethodHead {
				_, _ = w.Write([]byte("remote download"))
			}
		default:
			http.NotFound(w, r)
		}
	}))
	defer linkedSrv.Close()

	database, err := db.Open(filepath.Join(t.TempDir(), "test.db"))
	if err != nil {
		t.Fatalf("open db: %v", err)
	}
	defer database.Close()

	cfg := config.Config{
		FrontendOrigin:    "http://front.test",
		PrimaryAdminEmail: "admin@example.com",
		UploadDir:         filepath.Join(t.TempDir(), "uploads"),
		CookieSecure:      false,
	}
	srv := httptest.NewServer(newRouter(database, cfg, slog.New(slog.NewTextHandler(io.Discard, nil)), &fakeGateway{}))
	defer srv.Close()

	newClient := func(followRedirects bool) *http.Client {
		jar, _ := cookiejar.New(nil)
		client := &http.Client{Jar: jar}
		if !followRedirects {
			client.CheckRedirect = func(*http.Request, []*http.Request) error { return http.ErrUseLastResponse }
		}
		return client
	}
	adminClient := newClient(true)
	buyerClient := newClient(true)
	do := func(client *http.Client, method, path, body string) (*http.Response, []byte) {
		t.Helper()
		req, err := http.NewRequest(method, srv.URL+path, bytes.NewBufferString(body))
		if err != nil {
			t.Fatalf("request: %v", err)
		}
		if method == http.MethodPost || method == http.MethodPatch || method == http.MethodDelete {
			req.Header.Set("Origin", cfg.FrontendOrigin)
		}
		if body != "" {
			req.Header.Set("Content-Type", "application/json")
		}
		resp, err := client.Do(req)
		if err != nil {
			t.Fatalf("do %s %s: %v", method, path, err)
		}
		data, _ := io.ReadAll(resp.Body)
		resp.Body.Close()
		return resp, data
	}

	if resp, body := do(adminClient, http.MethodPost, "/api/register", `{"email":"admin@example.com","password":"hunter2pass"}`); resp.StatusCode != http.StatusOK {
		t.Fatalf("admin register: status %d body %s", resp.StatusCode, body)
	}
	resp, body := do(adminClient, http.MethodPost, "/api/admin/products", `{
		"sku":"linked-pack",
		"title":"Linked Pack",
		"description":"Uses linked assets.",
		"price_cents":500,
		"currency":"usd",
		"kind":"digital",
		"post_purchase_text":"Linked delivery.",
		"active":true
	}`)
	if resp.StatusCode != http.StatusCreated {
		t.Fatalf("create product: status %d body %s", resp.StatusCode, body)
	}
	var product struct {
		ID int64 `json:"id"`
	}
	if err := json.Unmarshal(body, &product); err != nil {
		t.Fatalf("decode product: %v", err)
	}

	resp, body = do(adminClient, http.MethodPost, fmt.Sprintf("/api/admin/products/%d/asset-links", product.ID), fmt.Sprintf(`{
		"role":"preview",
		"filename":"cover.png",
		"url":"%s/cover.png",
		"sort_order":0
	}`, linkedSrv.URL))
	if resp.StatusCode != http.StatusCreated {
		t.Fatalf("add preview link: status %d body %s", resp.StatusCode, body)
	}
	var preview struct {
		URL         string `json:"url"`
		SourceURL   string `json:"source_url"`
		ContentType string `json:"content_type"`
		SizeBytes   int64  `json:"size_bytes"`
	}
	if err := json.Unmarshal(body, &preview); err != nil {
		t.Fatalf("decode preview: %v", err)
	}
	if preview.SourceURL != linkedSrv.URL+"/cover.png" || preview.ContentType != "image/jpeg" || preview.SizeBytes == 0 {
		t.Fatalf("bad preview link response: %s", body)
	}
	resp, body = do(adminClient, http.MethodGet, preview.URL, "")
	if resp.StatusCode != http.StatusOK || resp.Header.Get("Content-Type") != "image/jpeg" || len(body) == 0 {
		t.Fatalf("preview thumbnail: status %d type %q len %d", resp.StatusCode, resp.Header.Get("Content-Type"), len(body))
	}

	resp, body = do(adminClient, http.MethodPost, fmt.Sprintf("/api/admin/products/%d/asset-links", product.ID), fmt.Sprintf(`{
		"role":"download",
		"filename":"remote.zip",
		"url":"%s/download.zip",
		"sort_order":0
	}`, linkedSrv.URL))
	if resp.StatusCode != http.StatusCreated {
		t.Fatalf("add download link: status %d body %s", resp.StatusCode, body)
	}
	var download struct {
		URL         string `json:"url"`
		SourceURL   string `json:"source_url"`
		ContentType string `json:"content_type"`
		SizeBytes   int64  `json:"size_bytes"`
	}
	if err := json.Unmarshal(body, &download); err != nil {
		t.Fatalf("decode download: %v", err)
	}
	if download.SourceURL != linkedSrv.URL+"/download.zip" || download.ContentType != "application/zip" || download.SizeBytes != int64(len("remote download")) {
		t.Fatalf("bad download link response: %s", body)
	}

	resp, body = do(buyerClient, http.MethodPost, "/api/register", `{"email":"buyer-linked@example.com","password":"hunter2pass"}`)
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("buyer register: status %d body %s", resp.StatusCode, body)
	}
	var buyer struct {
		ID int64 `json:"id"`
	}
	if err := json.Unmarshal(body, &buyer); err != nil {
		t.Fatalf("decode buyer: %v", err)
	}
	res, err := database.Exec(
		`INSERT INTO orders (user_id, status, total_cents, currency, created_at) VALUES (?, 'paid', 500, 'usd', ?)`,
		buyer.ID, time.Now().Unix())
	if err != nil {
		t.Fatalf("insert paid order: %v", err)
	}
	orderID, _ := res.LastInsertId()
	if _, err := database.Exec(
		`INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents) VALUES (?, ?, 1, 500)`,
		orderID, product.ID); err != nil {
		t.Fatalf("insert order item: %v", err)
	}
	resp, body = do(buyerClient, http.MethodGet, download.URL, "")
	if resp.StatusCode != http.StatusOK || string(body) != "remote download" {
		t.Fatalf("linked download: status %d body %q", resp.StatusCode, body)
	}
}

func TestCrossOriginRejected(t *testing.T) {
	database, err := db.Open(filepath.Join(t.TempDir(), "test.db"))
	if err != nil {
		t.Fatalf("open db: %v", err)
	}
	defer database.Close()

	cfg := config.Config{FrontendOrigin: "http://front.test"}
	srv := httptest.NewServer(newRouter(database, cfg, slog.New(slog.NewTextHandler(io.Discard, nil)), &fakeGateway{}))
	defer srv.Close()

	req, _ := http.NewRequest(http.MethodPost, srv.URL+"/api/login", bytes.NewBufferString(`{"email":"a@b.com","password":"x"}`))
	req.Header.Set("Origin", "http://evil.test")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatalf("do: %v", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusForbidden {
		t.Fatalf("cross-origin POST: want 403, got %d", resp.StatusCode)
	}
}

func TestAllowedOriginGetsCredentialedCORS(t *testing.T) {
	database, err := db.Open(filepath.Join(t.TempDir(), "test.db"))
	if err != nil {
		t.Fatalf("open db: %v", err)
	}
	defer database.Close()

	cfg := config.Config{FrontendOrigin: "http://front.test"}
	srv := httptest.NewServer(newRouter(database, cfg, slog.New(slog.NewTextHandler(io.Discard, nil)), &fakeGateway{}))
	defer srv.Close()

	req, _ := http.NewRequest(http.MethodOptions, srv.URL+"/api/login", nil)
	req.Header.Set("Origin", cfg.FrontendOrigin)
	req.Header.Set("Access-Control-Request-Method", http.MethodPost)
	req.Header.Set("Access-Control-Request-Headers", "Content-Type")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatalf("preflight: %v", err)
	}
	resp.Body.Close()
	if resp.StatusCode != http.StatusNoContent {
		t.Fatalf("preflight: want 204, got %d", resp.StatusCode)
	}
	assertCORS(t, resp, cfg.FrontendOrigin)
	if got := resp.Header.Get("Access-Control-Allow-Headers"); got != "Content-Type" {
		t.Fatalf("preflight allow headers = %q, want Content-Type", got)
	}

	req, _ = http.NewRequest(http.MethodGet, srv.URL+"/api/products", nil)
	req.Header.Set("Origin", cfg.FrontendOrigin)
	resp, err = http.DefaultClient.Do(req)
	if err != nil {
		t.Fatalf("products: %v", err)
	}
	resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("products: want 200, got %d", resp.StatusCode)
	}
	assertCORS(t, resp, cfg.FrontendOrigin)
}

func assertCORS(t *testing.T, resp *http.Response, origin string) {
	t.Helper()
	if got := resp.Header.Get("Access-Control-Allow-Origin"); got != origin {
		t.Fatalf("Access-Control-Allow-Origin = %q, want %q", got, origin)
	}
	if got := resp.Header.Get("Access-Control-Allow-Credentials"); got != "true" {
		t.Fatalf("Access-Control-Allow-Credentials = %q, want true", got)
	}
}

func signStripe(secret string, t time.Time, payload []byte) string {
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(strconv.FormatInt(t.Unix(), 10)))
	mac.Write([]byte("."))
	mac.Write(payload)
	return fmt.Sprintf("t=%d,v1=%s", t.Unix(), hex.EncodeToString(mac.Sum(nil)))
}

func orderStatus(t *testing.T, database *sql.DB, id int64) string {
	t.Helper()
	var status string
	if err := database.QueryRow(`SELECT status FROM orders WHERE id = ?`, id).Scan(&status); err != nil {
		t.Fatalf("order status: %v", err)
	}
	return status
}

func orderTotal(t *testing.T, database *sql.DB, id int64) int64 {
	t.Helper()
	var total int64
	if err := database.QueryRow(`SELECT total_cents FROM orders WHERE id = ?`, id).Scan(&total); err != nil {
		t.Fatalf("order total: %v", err)
	}
	return total
}
