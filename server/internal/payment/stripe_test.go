package payment

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"strconv"
	"testing"
	"time"
)

// sign produces a Stripe-Signature header for payload at time t.
func sign(secret string, t time.Time, payload []byte) string {
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(strconv.FormatInt(t.Unix(), 10)))
	mac.Write([]byte("."))
	mac.Write(payload)
	return fmt.Sprintf("t=%d,v1=%s", t.Unix(), hex.EncodeToString(mac.Sum(nil)))
}

func TestVerifyWebhook(t *testing.T) {
	const secret = "whsec_test"
	payload := []byte(`{"id":"evt_1","type":"checkout.session.completed","data":{"object":{"id":"cs_1"}}}`)

	t.Run("valid", func(t *testing.T) {
		ev, err := VerifyWebhook(payload, sign(secret, time.Now(), payload), secret)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if ev.ID != "evt_1" || ev.Type != "checkout.session.completed" {
			t.Fatalf("parsed event wrong: %+v", ev)
		}
	})

	t.Run("wrong secret", func(t *testing.T) {
		if _, err := VerifyWebhook(payload, sign("whsec_other", time.Now(), payload), secret); err != ErrInvalidSignature {
			t.Fatalf("want ErrInvalidSignature, got %v", err)
		}
	})

	t.Run("tampered payload", func(t *testing.T) {
		header := sign(secret, time.Now(), payload)
		if _, err := VerifyWebhook([]byte(`{"id":"evt_evil"}`), header, secret); err != ErrInvalidSignature {
			t.Fatalf("want ErrInvalidSignature, got %v", err)
		}
	})

	t.Run("stale timestamp", func(t *testing.T) {
		old := time.Now().Add(-10 * time.Minute)
		if _, err := VerifyWebhook(payload, sign(secret, old, payload), secret); err != ErrInvalidSignature {
			t.Fatalf("want ErrInvalidSignature for stale ts, got %v", err)
		}
	})

	t.Run("malformed header", func(t *testing.T) {
		if _, err := VerifyWebhook(payload, "garbage", secret); err != ErrInvalidSignature {
			t.Fatalf("want ErrInvalidSignature, got %v", err)
		}
	})
}
