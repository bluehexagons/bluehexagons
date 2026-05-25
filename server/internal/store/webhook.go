package store

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"

	"bluehexagons.com/server/internal/httpx"
	"bluehexagons.com/server/internal/payment"
)

const maxWebhookBytes = 1 << 20

// webhook receives Stripe events. It is authenticated by verifying the
// Stripe-Signature header (not a session cookie). On checkout.session.completed
// it fulfills the order; processing is idempotent across delivery retries.
func (h *Handler) webhook(w http.ResponseWriter, r *http.Request) error {
	if h.cfg.StripeWebhookSecret == "" {
		return httpx.Errorf(http.StatusServiceUnavailable, "webhook not configured")
	}
	body, err := io.ReadAll(http.MaxBytesReader(w, r.Body, maxWebhookBytes))
	if err != nil {
		return httpx.Errorf(http.StatusBadRequest, "could not read body")
	}

	ev, err := payment.VerifyWebhook(body, r.Header.Get("Stripe-Signature"), h.cfg.StripeWebhookSecret)
	if err != nil {
		return httpx.Errorf(http.StatusBadRequest, "invalid signature")
	}

	if ev.Type == "checkout.session.completed" {
		var obj payment.CheckoutSessionObject
		if err := json.Unmarshal(ev.Data.Object, &obj); err != nil {
			return httpx.Errorf(http.StatusBadRequest, "invalid event payload")
		}
		if err := h.fulfill(r.Context(), ev.ID, obj); err != nil && !errors.Is(err, errAlreadyProcessed) {
			// Return 500 so Stripe retries delivery.
			return err
		}
	}

	// Acknowledge all verified events (unhandled types are simply ignored).
	httpx.WriteJSON(w, http.StatusOK, map[string]string{"status": "ok"})
	return nil
}
