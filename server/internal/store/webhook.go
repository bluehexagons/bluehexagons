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
// Stripe-Signature header (not a session cookie). Paid sessions fulfill orders;
// failed or expired sessions cancel pending orders. Processing is idempotent.
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
	if ev.ID == "" || ev.Type == "" {
		return httpx.Errorf(http.StatusBadRequest, "invalid event payload")
	}

	if ev.Type == "checkout.session.completed" || ev.Type == "checkout.session.async_payment_succeeded" ||
		ev.Type == "checkout.session.async_payment_failed" || ev.Type == "checkout.session.expired" {
		var obj payment.CheckoutSessionObject
		if err := json.Unmarshal(ev.Data.Object, &obj); err != nil {
			return httpx.Errorf(http.StatusBadRequest, "invalid event payload")
		}
		var processErr error
		switch ev.Type {
		case "checkout.session.completed", "checkout.session.async_payment_succeeded":
			processErr = h.fulfill(r.Context(), ev.ID, obj)
		default:
			processErr = h.cancelPendingOrder(r.Context(), ev.ID, obj)
		}
		if processErr != nil && !errors.Is(processErr, errAlreadyProcessed) {
			// Return 500 so Stripe retries delivery.
			return processErr
		}
	}

	// Acknowledge all verified events (unhandled types are simply ignored).
	httpx.WriteJSON(w, http.StatusOK, map[string]string{"status": "ok"})
	return nil
}
