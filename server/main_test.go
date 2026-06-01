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
	"io"
	"log/slog"
	"net/http"
	"net/http/cookiejar"
	"net/http/httptest"
	"path/filepath"
	"strconv"
	"testing"
	"time"

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
	event := fmt.Sprintf(`{"id":"evt_1","type":"checkout.session.completed","data":{"object":`+
		`{"id":"cs_test_123","client_reference_id":"%d","payment_status":"paid","amount_total":%d,"currency":"usd"}}}`,
		co.OrderID, priceCents*2)

	postWebhook := func() int {
		req, _ := http.NewRequest(http.MethodPost, srv.URL+"/api/webhooks/stripe", bytes.NewBufferString(event))
		req.Header.Set("Stripe-Signature", signStripe(cfg.StripeWebhookSecret, time.Now(), []byte(event)))
		resp, err := client.Do(req)
		if err != nil {
			t.Fatalf("webhook: %v", err)
		}
		resp.Body.Close()
		return resp.StatusCode
	}

	if code := postWebhook(); code != 200 {
		t.Fatalf("webhook: status %d", code)
	}
	if got := orderStatus(t, database, co.OrderID); got != "paid" {
		t.Fatalf("order status after webhook = %q, want paid", got)
	}
	// Redelivery of the same event must not reprocess.
	if code := postWebhook(); code != 200 {
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
