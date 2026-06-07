package store

import (
	"context"
	"database/sql"
	"errors"
	"net/http"
	"strconv"
	"strings"
	"time"

	"bluehexagons.com/server/internal/auth"
	"bluehexagons.com/server/internal/db"
	"bluehexagons.com/server/internal/httpx"
)

const (
	maxSKULen              = 96
	maxProductTitleLen     = 180
	maxDescriptionLen      = 12000
	maxPostPurchaseTextLen = 40000
	maxKeysPerRequest      = 5000
	maxKeyTextLen          = 1000
)

type AdminProduct struct {
	Product
	Active           bool              `json:"active"`
	PostPurchaseText string            `json:"post_purchase_text"`
	Downloads        []ProductAsset    `json:"downloads"`
	KeyStats         ProductKeyStats   `json:"key_stats"`
	Keys             []AdminProductKey `json:"keys,omitempty"`
}

type ProductKeyStats struct {
	Total     int64 `json:"total"`
	Remaining int64 `json:"remaining"`
	Claimed   int64 `json:"claimed"`
}

type AdminProductKey struct {
	ID                 int64  `json:"id"`
	ProductID          int64  `json:"product_id"`
	KeyText            string `json:"key_text"`
	ClaimedOrderItemID *int64 `json:"claimed_order_item_id"`
	ClaimedUserID      *int64 `json:"claimed_user_id"`
	ClaimedUserEmail   string `json:"claimed_user_email,omitempty"`
	ClaimedAt          *int64 `json:"claimed_at"`
	CreatedAt          int64  `json:"created_at"`
}

type adminProductInput struct {
	SKU              string `json:"sku"`
	Title            string `json:"title"`
	Description      string `json:"description"`
	PriceCents       int64  `json:"price_cents"`
	Currency         string `json:"currency"`
	Kind             string `json:"kind"`
	PostPurchaseText string `json:"post_purchase_text"`
	Active           *bool  `json:"active"`
}

type addKeysRequest struct {
	Keys []string `json:"keys"`
	Text string   `json:"text"`
}

func (h *Handler) requireAdmin(next http.Handler) http.Handler {
	return h.requireUser(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		uid, ok := auth.UserID(r.Context())
		if !ok {
			httpx.WriteError(w, httpx.Errorf(http.StatusUnauthorized, "not authenticated"))
			return
		}
		isAdmin, err := auth.UserIsAdmin(r.Context(), h.db, h.cfg, uid)
		if err != nil {
			h.log.Error("admin lookup", "err", err)
			httpx.WriteError(w, httpx.Errorf(http.StatusInternalServerError, "internal error"))
			return
		}
		if !isAdmin {
			httpx.WriteError(w, httpx.Errorf(http.StatusForbidden, "admin access required"))
			return
		}
		next.ServeHTTP(w, r)
	}))
}

func (h *Handler) adminListProducts(w http.ResponseWriter, r *http.Request) error {
	rows, err := h.db.QueryContext(r.Context(),
		`SELECT `+productColumns+`, p.active, COALESCE(d.post_purchase_text, '')
		 FROM products p
		 LEFT JOIN product_details d ON d.product_id = p.id
		 ORDER BY p.id DESC`)
	if err != nil {
		return err
	}
	defer rows.Close()

	products := []AdminProduct{}
	for rows.Next() {
		p, err := scanAdminProduct(rows)
		if err != nil {
			return err
		}
		if err := h.hydrateAdminProduct(r.Context(), &p, false); err != nil {
			return err
		}
		products = append(products, p)
	}
	if err := rows.Err(); err != nil {
		return err
	}
	httpx.WriteJSON(w, http.StatusOK, products)
	return nil
}

func (h *Handler) adminGetProduct(w http.ResponseWriter, r *http.Request) error {
	id, err := pathID(r, "id")
	if err != nil {
		return err
	}
	p, err := h.loadAdminProduct(r.Context(), id, true)
	if err != nil {
		return err
	}
	httpx.WriteJSON(w, http.StatusOK, p)
	return nil
}

func (h *Handler) adminCreateProduct(w http.ResponseWriter, r *http.Request) error {
	var in adminProductInput
	if err := httpx.DecodeJSON(w, r, &in); err != nil {
		return err
	}
	normalized, err := validateAdminProductInput(in, true)
	if err != nil {
		return err
	}

	tx, err := h.db.BeginTx(r.Context(), nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	now := time.Now().Unix()
	res, err := tx.ExecContext(r.Context(),
		`INSERT INTO products (sku, name, description, price_cents, currency, active)
		 VALUES (?, ?, ?, ?, ?, ?)`,
		normalized.SKU, normalized.Title, normalized.Description, normalized.PriceCents, normalized.Currency, boolInt(*normalized.Active))
	if err != nil {
		if db.IsUniqueViolation(err) {
			return httpx.Errorf(http.StatusConflict, "sku already exists")
		}
		return err
	}
	id, err := res.LastInsertId()
	if err != nil {
		return err
	}
	if _, err := tx.ExecContext(r.Context(),
		`INSERT INTO product_details (product_id, kind, post_purchase_text, created_at, updated_at)
		 VALUES (?, ?, ?, ?, ?)`,
		id, normalized.Kind, normalized.PostPurchaseText, now, now); err != nil {
		return err
	}
	if err := tx.Commit(); err != nil {
		return err
	}

	p, err := h.loadAdminProduct(r.Context(), id, true)
	if err != nil {
		return err
	}
	httpx.WriteJSON(w, http.StatusCreated, p)
	return nil
}

func (h *Handler) adminUpdateProduct(w http.ResponseWriter, r *http.Request) error {
	id, err := pathID(r, "id")
	if err != nil {
		return err
	}
	var in adminProductInput
	if err := httpx.DecodeJSON(w, r, &in); err != nil {
		return err
	}
	normalized, err := validateAdminProductInput(in, false)
	if err != nil {
		return err
	}

	tx, err := h.db.BeginTx(r.Context(), nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	var exists int
	if err := tx.QueryRowContext(r.Context(), `SELECT 1 FROM products WHERE id = ?`, id).Scan(&exists); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return httpx.Errorf(http.StatusNotFound, "product not found")
		}
		return err
	}
	if _, err := tx.ExecContext(r.Context(),
		`UPDATE products
		 SET sku = ?, name = ?, description = ?, price_cents = ?, currency = ?, active = ?
		 WHERE id = ?`,
		normalized.SKU, normalized.Title, normalized.Description, normalized.PriceCents, normalized.Currency,
		boolInt(*normalized.Active), id); err != nil {
		if db.IsUniqueViolation(err) {
			return httpx.Errorf(http.StatusConflict, "sku already exists")
		}
		return err
	}
	now := time.Now().Unix()
	if _, err := tx.ExecContext(r.Context(),
		`INSERT INTO product_details (product_id, kind, post_purchase_text, created_at, updated_at)
		 VALUES (?, ?, ?, ?, ?)
		 ON CONFLICT(product_id) DO UPDATE SET
		 kind = excluded.kind,
		 post_purchase_text = excluded.post_purchase_text,
		 updated_at = excluded.updated_at`,
		id, normalized.Kind, normalized.PostPurchaseText, now, now); err != nil {
		return err
	}
	if err := tx.Commit(); err != nil {
		return err
	}

	p, err := h.loadAdminProduct(r.Context(), id, true)
	if err != nil {
		return err
	}
	httpx.WriteJSON(w, http.StatusOK, p)
	return nil
}

func (h *Handler) adminAddKeys(w http.ResponseWriter, r *http.Request) error {
	productID, err := pathID(r, "id")
	if err != nil {
		return err
	}
	var req addKeysRequest
	if err := httpx.DecodeJSON(w, r, &req); err != nil {
		return err
	}
	keys, err := normalizeKeyBatch(req)
	if err != nil {
		return err
	}

	tx, err := h.db.BeginTx(r.Context(), nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()
	var exists int
	if err := tx.QueryRowContext(r.Context(), `SELECT 1 FROM products WHERE id = ?`, productID).Scan(&exists); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return httpx.Errorf(http.StatusNotFound, "product not found")
		}
		return err
	}
	now := time.Now().Unix()
	for _, key := range keys {
		if _, err := tx.ExecContext(r.Context(),
			`INSERT OR IGNORE INTO product_keys (product_id, key_text, created_at) VALUES (?, ?, ?)`,
			productID, key, now); err != nil {
			return err
		}
	}
	if err := tx.Commit(); err != nil {
		return err
	}

	p, err := h.loadAdminProduct(r.Context(), productID, true)
	if err != nil {
		return err
	}
	httpx.WriteJSON(w, http.StatusOK, p)
	return nil
}

func (h *Handler) adminDeleteKey(w http.ResponseWriter, r *http.Request) error {
	id, err := pathID(r, "id")
	if err != nil {
		return err
	}
	res, err := h.db.ExecContext(r.Context(), `DELETE FROM product_keys WHERE id = ? AND claimed_at IS NULL`, id)
	if err != nil {
		return err
	}
	if n, _ := res.RowsAffected(); n == 1 {
		httpx.WriteJSON(w, http.StatusOK, map[string]string{"status": "ok"})
		return nil
	}
	var claimed sql.NullInt64
	err = h.db.QueryRowContext(r.Context(), `SELECT claimed_at FROM product_keys WHERE id = ?`, id).Scan(&claimed)
	if errors.Is(err, sql.ErrNoRows) {
		return httpx.Errorf(http.StatusNotFound, "key not found")
	}
	if err != nil {
		return err
	}
	return httpx.Errorf(http.StatusConflict, "claimed keys cannot be deleted")
}

func (h *Handler) loadAdminProduct(ctx context.Context, id int64, includeKeys bool) (AdminProduct, error) {
	row := h.db.QueryRowContext(ctx,
		`SELECT `+productColumns+`, p.active, COALESCE(d.post_purchase_text, '')
		 FROM products p
		 LEFT JOIN product_details d ON d.product_id = p.id
		 WHERE p.id = ?`, id)
	p, err := scanAdminProduct(row)
	if errors.Is(err, sql.ErrNoRows) {
		return AdminProduct{}, httpx.Errorf(http.StatusNotFound, "product not found")
	}
	if err != nil {
		return AdminProduct{}, err
	}
	if err := h.hydrateAdminProduct(ctx, &p, includeKeys); err != nil {
		return AdminProduct{}, err
	}
	return p, nil
}

func (h *Handler) hydrateAdminProduct(ctx context.Context, p *AdminProduct, includeKeys bool) error {
	var err error
	p.Previews, err = h.productAssets(ctx, p.ID, "preview")
	if err != nil {
		return err
	}
	p.Downloads, err = h.productAssets(ctx, p.ID, "download")
	if err != nil {
		return err
	}
	p.KeyStats, err = h.productKeyStats(ctx, p.ID)
	if err != nil {
		return err
	}
	if includeKeys {
		p.Keys, err = h.productKeys(ctx, p.ID)
		if err != nil {
			return err
		}
	}
	return nil
}

func scanAdminProduct(s interface{ Scan(...any) error }) (AdminProduct, error) {
	var p AdminProduct
	var active int
	err := s.Scan(&p.ID, &p.SKU, &p.Name, &p.Description, &p.PriceCents, &p.Currency, &p.Kind, &active, &p.PostPurchaseText)
	p.Title = p.Name
	p.Active = active != 0
	p.Previews = []ProductAsset{}
	p.Downloads = []ProductAsset{}
	p.Keys = []AdminProductKey{}
	return p, err
}

func (h *Handler) productKeyStats(ctx context.Context, productID int64) (ProductKeyStats, error) {
	var s ProductKeyStats
	err := h.db.QueryRowContext(ctx,
		`SELECT COUNT(*),
		 COALESCE(SUM(CASE WHEN claimed_at IS NULL THEN 1 ELSE 0 END), 0),
		 COALESCE(SUM(CASE WHEN claimed_at IS NOT NULL THEN 1 ELSE 0 END), 0)
		 FROM product_keys
		 WHERE product_id = ?`, productID).Scan(&s.Total, &s.Remaining, &s.Claimed)
	return s, err
}

func (h *Handler) productKeys(ctx context.Context, productID int64) ([]AdminProductKey, error) {
	rows, err := h.db.QueryContext(ctx,
		`SELECT k.id, k.product_id, k.key_text, k.claimed_order_item_id, k.claimed_user_id,
		 COALESCE(u.email, ''), k.claimed_at, k.created_at
		 FROM product_keys k
		 LEFT JOIN users u ON u.id = k.claimed_user_id
		 WHERE k.product_id = ?
		 ORDER BY k.claimed_at IS NOT NULL, k.id`, productID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	keys := []AdminProductKey{}
	for rows.Next() {
		var k AdminProductKey
		var orderItemID, userID, claimedAt sql.NullInt64
		if err := rows.Scan(&k.ID, &k.ProductID, &k.KeyText, &orderItemID, &userID, &k.ClaimedUserEmail, &claimedAt, &k.CreatedAt); err != nil {
			return nil, err
		}
		k.ClaimedOrderItemID = nullInt64Ptr(orderItemID)
		k.ClaimedUserID = nullInt64Ptr(userID)
		k.ClaimedAt = nullInt64Ptr(claimedAt)
		keys = append(keys, k)
	}
	return keys, rows.Err()
}

func validateAdminProductInput(in adminProductInput, create bool) (adminProductInput, error) {
	in.SKU = strings.TrimSpace(in.SKU)
	in.Title = strings.TrimSpace(in.Title)
	in.Currency = strings.ToLower(strings.TrimSpace(in.Currency))
	in.Kind = strings.ToLower(strings.TrimSpace(in.Kind))
	in.Description = strings.TrimSpace(in.Description)
	in.PostPurchaseText = strings.TrimSpace(in.PostPurchaseText)
	if in.Kind == "" {
		in.Kind = "digital"
	}
	if in.Currency == "" {
		in.Currency = "usd"
	}
	if in.Active == nil {
		active := true
		in.Active = &active
	}
	if in.SKU == "" || len(in.SKU) > maxSKULen {
		return in, httpx.Errorf(http.StatusBadRequest, "sku is required")
	}
	if strings.ContainsAny(in.SKU, "\x00\r\n\t ") {
		return in, httpx.Errorf(http.StatusBadRequest, "sku cannot contain whitespace")
	}
	if in.Title == "" || len(in.Title) > maxProductTitleLen {
		return in, httpx.Errorf(http.StatusBadRequest, "title is required")
	}
	if len(in.Description) > maxDescriptionLen {
		return in, httpx.Errorf(http.StatusBadRequest, "description is too long")
	}
	if len(in.PostPurchaseText) > maxPostPurchaseTextLen {
		return in, httpx.Errorf(http.StatusBadRequest, "post-purchase text is too long")
	}
	if in.PriceCents < 0 {
		return in, httpx.Errorf(http.StatusBadRequest, "price must be non-negative")
	}
	if len(in.Currency) != 3 {
		return in, httpx.Errorf(http.StatusBadRequest, "currency must be a three-letter code")
	}
	for _, ch := range in.Currency {
		if ch < 'a' || ch > 'z' {
			return in, httpx.Errorf(http.StatusBadRequest, "currency must be a three-letter code")
		}
	}
	if in.Kind != "digital" && in.Kind != "physical" {
		return in, httpx.Errorf(http.StatusBadRequest, "kind must be digital or physical")
	}
	return in, nil
}

func normalizeKeyBatch(req addKeysRequest) ([]string, error) {
	raw := append([]string{}, req.Keys...)
	if req.Text != "" {
		raw = append(raw, strings.Split(req.Text, "\n")...)
	}
	seen := map[string]struct{}{}
	keys := []string{}
	for _, key := range raw {
		key = strings.TrimSpace(key)
		if key == "" {
			continue
		}
		if len(key) > maxKeyTextLen {
			return nil, httpx.Errorf(http.StatusBadRequest, "key is too long")
		}
		if _, ok := seen[key]; ok {
			continue
		}
		seen[key] = struct{}{}
		keys = append(keys, key)
	}
	if len(keys) == 0 {
		return nil, httpx.Errorf(http.StatusBadRequest, "at least one key is required")
	}
	if len(keys) > maxKeysPerRequest {
		return nil, httpx.Errorf(http.StatusBadRequest, "too many keys in one request")
	}
	return keys, nil
}

func pathID(r *http.Request, name string) (int64, error) {
	id, err := strconv.ParseInt(r.PathValue(name), 10, 64)
	if err != nil || id <= 0 {
		return 0, httpx.Errorf(http.StatusBadRequest, "invalid id")
	}
	return id, nil
}

func boolInt(v bool) int {
	if v {
		return 1
	}
	return 0
}

func nullInt64Ptr(v sql.NullInt64) *int64 {
	if !v.Valid {
		return nil
	}
	return &v.Int64
}

func ensureProductExists(ctx context.Context, database *sql.DB, productID int64) error {
	var exists int
	if err := database.QueryRowContext(ctx, `SELECT 1 FROM products WHERE id = ?`, productID).Scan(&exists); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return httpx.Errorf(http.StatusNotFound, "product not found")
		}
		return err
	}
	return nil
}
