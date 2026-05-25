package store

import (
	"database/sql"
	"errors"
	"net/http"
	"strconv"

	"bluehexagons.com/server/internal/httpx"
)

// Product is a catalog item as exposed to clients.
type Product struct {
	ID          int64  `json:"id"`
	SKU         string `json:"sku"`
	Name        string `json:"name"`
	Description string `json:"description"`
	PriceCents  int64  `json:"price_cents"`
	Currency    string `json:"currency"`
}

const productColumns = `id, sku, name, description, price_cents, currency`

func scanProduct(s interface{ Scan(...any) error }) (Product, error) {
	var p Product
	err := s.Scan(&p.ID, &p.SKU, &p.Name, &p.Description, &p.PriceCents, &p.Currency)
	return p, err
}

func (h *Handler) listProducts(w http.ResponseWriter, r *http.Request) error {
	rows, err := h.db.QueryContext(r.Context(),
		`SELECT `+productColumns+` FROM products WHERE active = 1 ORDER BY id`)
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
		`SELECT `+productColumns+` FROM products WHERE id = ? AND active = 1`, id)
	p, err := scanProduct(row)
	if errors.Is(err, sql.ErrNoRows) {
		return httpx.Errorf(http.StatusNotFound, "product not found")
	}
	if err != nil {
		return err
	}
	httpx.WriteJSON(w, http.StatusOK, p)
	return nil
}
