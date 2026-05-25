// Package store implements the product catalog, cart checkout, and order
// fulfillment. It owns all order-related database state and delegates the
// actual charge to the payment package (Stripe Checkout over REST). Together
// with payment and auth it forms the shop subsystem, isolated for audit.
package store

import (
	"context"
	"database/sql"
	"log/slog"
	"net/http"

	"bluehexagons.com/server/internal/config"
	"bluehexagons.com/server/internal/httpx"
	"bluehexagons.com/server/internal/payment"
)

// Middleware wraps a handler with request-scoped behavior (e.g. requiring auth).
type Middleware func(http.Handler) http.Handler

// CheckoutGateway creates hosted checkout sessions. *payment.Client implements
// it; tests substitute a fake. Depending on an interface keeps the store
// decoupled from the network and the Stripe details.
type CheckoutGateway interface {
	Configured() bool
	CreateCheckoutSession(ctx context.Context, p payment.CheckoutParams) (*payment.CheckoutSession, error)
}

// Handler holds the dependencies for the store endpoints.
type Handler struct {
	db          *sql.DB
	cfg         config.Config
	log         *slog.Logger
	pay         CheckoutGateway
	requireUser Middleware
}

func NewHandler(database *sql.DB, cfg config.Config, log *slog.Logger, pay CheckoutGateway, requireUser Middleware) *Handler {
	return &Handler{db: database, cfg: cfg, log: log, pay: pay, requireUser: requireUser}
}

// Routes registers the store endpoints. /api/checkout requires a session;
// /api/webhooks/stripe is authenticated by Stripe's signature, not a cookie.
func (h *Handler) Routes(mux *http.ServeMux) {
	mux.HandleFunc("GET /api/products", httpx.Logged(h.log, h.listProducts))
	mux.HandleFunc("GET /api/products/{id}", httpx.Logged(h.log, h.getProduct))
	mux.Handle("POST /api/checkout", h.requireUser(httpx.Logged(h.log, h.checkout)))
	mux.HandleFunc("POST /api/webhooks/stripe", httpx.Logged(h.log, h.webhook))
}

// SeedDemo inserts example products if the catalog is empty. Intended for local
// development; call it from main gated behind an env flag.
func SeedDemo(ctx context.Context, database *sql.DB) error {
	var count int
	if err := database.QueryRowContext(ctx, `SELECT COUNT(*) FROM products`).Scan(&count); err != nil {
		return err
	}
	if count > 0 {
		return nil
	}
	_, err := database.ExecContext(ctx, `
		INSERT INTO products (sku, name, description, price_cents, currency) VALUES
		('antistatic-key', 'Antistatic — Steam Key', 'A digital key for Antistatic.', 1999, 'usd'),
		('antistatic-ost', 'Antistatic — Soundtrack', 'The full original soundtrack (FLAC + MP3).', 999, 'usd'),
		('supporter-pack', 'Supporter Pack', 'Game key, soundtrack, and your name in the credits.', 4999, 'usd')`)
	return err
}
