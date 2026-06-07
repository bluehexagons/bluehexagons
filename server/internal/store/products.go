package store

import (
	"context"
	"database/sql"
	"errors"
	"net/http"
	"strconv"

	"bluehexagons.com/server/internal/httpx"
)

// Product is a catalog item as exposed to clients.
type Product struct {
	ID          int64          `json:"id"`
	SKU         string         `json:"sku"`
	Name        string         `json:"name"`
	Title       string         `json:"title"`
	Description string         `json:"description"`
	PriceCents  int64          `json:"price_cents"`
	Currency    string         `json:"currency"`
	Kind        string         `json:"kind"`
	Previews    []ProductAsset `json:"previews"`
}

type ProductAsset struct {
	ID          int64  `json:"id"`
	ProductID   int64  `json:"product_id,omitempty"`
	Role        string `json:"role"`
	Filename    string `json:"filename"`
	ContentType string `json:"content_type"`
	SizeBytes   int64  `json:"size_bytes"`
	SourceURL   string `json:"source_url,omitempty"`
	SortOrder   int64  `json:"sort_order"`
	URL         string `json:"url"`
}

const productColumns = `p.id, p.sku, p.name, p.description, p.price_cents, p.currency, COALESCE(d.kind, 'digital')`

func scanProduct(s interface{ Scan(...any) error }) (Product, error) {
	var p Product
	err := s.Scan(&p.ID, &p.SKU, &p.Name, &p.Description, &p.PriceCents, &p.Currency, &p.Kind)
	p.Title = p.Name
	p.Previews = []ProductAsset{}
	return p, err
}

func (h *Handler) listProducts(w http.ResponseWriter, r *http.Request) error {
	rows, err := h.db.QueryContext(r.Context(),
		`SELECT `+productColumns+`
		 FROM products p
		 LEFT JOIN product_details d ON d.product_id = p.id
		 WHERE p.active = 1
		 ORDER BY p.id`)
	if err != nil {
		return err
	}
	defer rows.Close()

	products := []Product{}
	for rows.Next() {
		p, err := scanProduct(rows)
		if err != nil {
			return err
		}
		p.Previews, err = h.productAssets(r.Context(), p.ID, "preview")
		if err != nil {
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

func (h *Handler) getProduct(w http.ResponseWriter, r *http.Request) error {
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil || id <= 0 {
		return httpx.Errorf(http.StatusBadRequest, "invalid product id")
	}
	row := h.db.QueryRowContext(r.Context(),
		`SELECT `+productColumns+`
		 FROM products p
		 LEFT JOIN product_details d ON d.product_id = p.id
		 WHERE p.id = ? AND p.active = 1`, id)
	p, err := scanProduct(row)
	if errors.Is(err, sql.ErrNoRows) {
		return httpx.Errorf(http.StatusNotFound, "product not found")
	}
	if err != nil {
		return err
	}
	p.Previews, err = h.productAssets(r.Context(), p.ID, "preview")
	if err != nil {
		return err
	}
	httpx.WriteJSON(w, http.StatusOK, p)
	return nil
}

func (h *Handler) productAssets(ctx context.Context, productID int64, role string) ([]ProductAsset, error) {
	rows, err := h.db.QueryContext(ctx,
		`SELECT id, product_id, role, filename, content_type, size_bytes, COALESCE(source_url, ''), sort_order
		 FROM product_assets
		 WHERE product_id = ? AND role = ?
		 ORDER BY sort_order, id`, productID, role)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	assets := []ProductAsset{}
	for rows.Next() {
		var a ProductAsset
		if err := rows.Scan(&a.ID, &a.ProductID, &a.Role, &a.Filename, &a.ContentType, &a.SizeBytes, &a.SourceURL, &a.SortOrder); err != nil {
			return nil, err
		}
		a.URL = assetURL(a.ID, a.Role)
		assets = append(assets, a)
	}
	return assets, rows.Err()
}
