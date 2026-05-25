package store

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"bluehexagons.com/server/internal/auth"
	"bluehexagons.com/server/internal/db"
	"bluehexagons.com/server/internal/httpx"
	"bluehexagons.com/server/internal/payment"
)

const (
	maxCartItems       = 50
	maxQuantityPerItem = 100
)

type cartItem struct {
	ProductID int64 `json:"product_id"`
	Quantity  int64 `json:"quantity"`
}

type checkoutRequest struct {
	Items []cartItem `json:"items"`
}

// checkout validates the cart against authoritative DB prices, records a
// pending order, and starts a Stripe Checkout Session.
func (h *Handler) checkout(w http.ResponseWriter, r *http.Request) error {
	if !h.pay.Configured() {
		return httpx.Errorf(http.StatusServiceUnavailable, "payments are not configured")
	}
	uid, ok := auth.UserID(r.Context())
	if !ok {
		return httpx.Errorf(http.StatusUnauthorized, "not authenticated")
	}

	var req checkoutRequest
	if err := httpx.DecodeJSON(w, r, &req); err != nil {
		return err
	}
	if len(req.Items) == 0 || len(req.Items) > maxCartItems {
		return httpx.Errorf(http.StatusBadRequest, "cart must contain 1–50 items")
	}
	for _, it := range req.Items {
		if it.ProductID <= 0 {
			return httpx.Errorf(http.StatusBadRequest, "invalid product id")
		}
		if it.Quantity <= 0 || it.Quantity > maxQuantityPerItem {
			return httpx.Errorf(http.StatusBadRequest, "invalid quantity")
		}
	}

	orderID, lines, err := h.createOrder(r.Context(), uid, req.Items)
	if err != nil {
		return err
	}

	var email string
	_ = h.db.QueryRowContext(r.Context(), `SELECT email FROM users WHERE id = ?`, uid).Scan(&email)

	sess, err := h.pay.CreateCheckoutSession(r.Context(), payment.CheckoutParams{
		LineItems:         lines,
		SuccessURL:        h.cfg.FrontendOrigin + "/shop/success.html?order=" + strconv.FormatInt(orderID, 10),
		CancelURL:         h.cfg.FrontendOrigin + "/shop/",
		ClientReferenceID: strconv.FormatInt(orderID, 10),
		CustomerEmail:     email,
		IdempotencyKey:    "order-" + strconv.FormatInt(orderID, 10),
	})
	if err != nil {
		h.log.Error("stripe checkout", "order", orderID, "err", err)
		return httpx.Errorf(http.StatusBadGateway, "could not start checkout")
	}

	if _, err := h.db.ExecContext(r.Context(),
		`UPDATE orders SET stripe_session_id = ? WHERE id = ?`, sess.ID, orderID); err != nil {
		// Non-fatal: the webhook resolves the order by client_reference_id too.
		h.log.Error("record stripe session", "order", orderID, "err", err)
	}

	httpx.WriteJSON(w, http.StatusOK, map[string]any{
		"order_id":     orderID,
		"checkout_url": sess.URL,
	})
	return nil
}

// createOrder validates each cart item against the DB (the only source of truth
// for prices) and inserts the order plus its items atomically. It returns the
// new order id and the Stripe line items.
func (h *Handler) createOrder(ctx context.Context, userID int64, items []cartItem) (int64, []payment.LineItem, error) {
	tx, err := h.db.BeginTx(ctx, nil)
	if err != nil {
		return 0, nil, err
	}
	defer tx.Rollback()

	type lineRow struct {
		productID, quantity, unitCents int64
	}

	var total int64
	var currency string
	lines := make([]payment.LineItem, 0, len(items))
	rows := make([]lineRow, 0, len(items))

	for _, it := range items {
		var name, cur string
		var price int64
		err := tx.QueryRowContext(ctx,
			`SELECT name, price_cents, currency FROM products WHERE id = ? AND active = 1`,
			it.ProductID).Scan(&name, &price, &cur)
		if errors.Is(err, sql.ErrNoRows) {
			return 0, nil, httpx.Errorf(http.StatusBadRequest,
				fmt.Sprintf("product %d is unavailable", it.ProductID))
		}
		if err != nil {
			return 0, nil, err
		}
		if currency == "" {
			currency = cur
		} else if cur != currency {
			return 0, nil, httpx.Errorf(http.StatusBadRequest, "cart contains mixed currencies")
		}
		total += price * it.Quantity
		lines = append(lines, payment.LineItem{
			Name: name, Currency: cur, AmountCents: price, Quantity: it.Quantity,
		})
		rows = append(rows, lineRow{it.ProductID, it.Quantity, price})
	}

	res, err := tx.ExecContext(ctx,
		`INSERT INTO orders (user_id, status, total_cents, currency, created_at)
		 VALUES (?, 'pending', ?, ?, ?)`,
		userID, total, currency, time.Now().Unix())
	if err != nil {
		return 0, nil, err
	}
	orderID, err := res.LastInsertId()
	if err != nil {
		return 0, nil, err
	}
	for _, ln := range rows {
		if _, err := tx.ExecContext(ctx,
			`INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents)
			 VALUES (?, ?, ?, ?)`,
			orderID, ln.productID, ln.quantity, ln.unitCents); err != nil {
			return 0, nil, err
		}
	}
	if err := tx.Commit(); err != nil {
		return 0, nil, err
	}
	return orderID, lines, nil
}

// errAlreadyProcessed signals a webhook event we have already handled.
var errAlreadyProcessed = errors.New("event already processed")

// fulfill marks the order paid and records the event id, atomically, so Stripe
// delivery retries are idempotent. Returns errAlreadyProcessed if the event was
// already handled (caller should still ack 200).
func (h *Handler) fulfill(ctx context.Context, eventID string, obj payment.CheckoutSessionObject) error {
	if obj.PaymentStatus != "paid" {
		return nil // session completed without payment captured; nothing to fulfill
	}
	orderID, err := strconv.ParseInt(obj.ClientReferenceID, 10, 64)
	if err != nil {
		return fmt.Errorf("bad client_reference_id %q: %w", obj.ClientReferenceID, err)
	}

	tx, err := h.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	if _, err := tx.ExecContext(ctx,
		`INSERT INTO processed_events (event_id, processed_at) VALUES (?, ?)`,
		eventID, time.Now().Unix()); err != nil {
		if db.IsUniqueViolation(err) {
			return errAlreadyProcessed
		}
		return err
	}

	res, err := tx.ExecContext(ctx,
		`UPDATE orders SET status = 'paid' WHERE id = ? AND status = 'pending'`, orderID)
	if err != nil {
		return err
	}
	if n, _ := res.RowsAffected(); n == 0 {
		// Order missing or not pending (already paid/cancelled). Record the
		// event anyway so we don't reprocess; just note it.
		h.log.Warn("order not updated on fulfillment", "order", orderID, "session", obj.ID)
	}

	// Extension point: grant entitlements / allocate digital keys / queue a
	// confirmation email here, inside this transaction, before commit.

	return tx.Commit()
}
