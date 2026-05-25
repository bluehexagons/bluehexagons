// Package payment integrates Stripe Checkout over its REST API using only the
// standard library — no Stripe SDK. It creates hosted Checkout Sessions (so
// card data never touches this server) and verifies webhook signatures. It
// holds no database state, which keeps the payment surface small and auditable.
package payment

import (
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"
)

const (
	stripeAPI        = "https://api.stripe.com"
	maxResponseBytes = 1 << 20
	webhookTolerance = 5 * time.Minute
)

// ErrInvalidSignature is returned when a webhook signature does not verify.
var ErrInvalidSignature = errors.New("invalid stripe signature")

// Client talks to the Stripe REST API with a secret key.
type Client struct {
	secretKey string
	http      *http.Client
}

func NewClient(secretKey string) *Client {
	return &Client{secretKey: secretKey, http: &http.Client{Timeout: 20 * time.Second}}
}

// Configured reports whether a secret key is set.
func (c *Client) Configured() bool { return c.secretKey != "" }

// LineItem is one product line in a checkout session. Amount is in the
// currency's minor unit (e.g. cents).
type LineItem struct {
	Name        string
	Currency    string
	AmountCents int64
	Quantity    int64
}

// CheckoutParams configures a Checkout Session.
type CheckoutParams struct {
	LineItems         []LineItem
	SuccessURL        string
	CancelURL         string
	ClientReferenceID string // our order id, echoed back on the webhook
	CustomerEmail     string
	IdempotencyKey    string
}

// CheckoutSession is the subset of Stripe's response we use.
type CheckoutSession struct {
	ID  string `json:"id"`
	URL string `json:"url"`
}

// CreateCheckoutSession creates a Stripe Checkout Session and returns its id
// and hosted URL.
func (c *Client) CreateCheckoutSession(ctx context.Context, p CheckoutParams) (*CheckoutSession, error) {
	form := url.Values{}
	form.Set("mode", "payment")
	form.Set("success_url", p.SuccessURL)
	form.Set("cancel_url", p.CancelURL)
	if p.ClientReferenceID != "" {
		form.Set("client_reference_id", p.ClientReferenceID)
	}
	if p.CustomerEmail != "" {
		form.Set("customer_email", p.CustomerEmail)
	}
	for i, li := range p.LineItems {
		prefix := fmt.Sprintf("line_items[%d]", i)
		form.Set(prefix+"[quantity]", strconv.FormatInt(li.Quantity, 10))
		form.Set(prefix+"[price_data][currency]", li.Currency)
		form.Set(prefix+"[price_data][unit_amount]", strconv.FormatInt(li.AmountCents, 10))
		form.Set(prefix+"[price_data][product_data][name]", li.Name)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost,
		stripeAPI+"/v1/checkout/sessions", strings.NewReader(form.Encode()))
	if err != nil {
		return nil, err
	}
	req.SetBasicAuth(c.secretKey, "") // Stripe uses the secret key as the basic-auth username
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	if p.IdempotencyKey != "" {
		req.Header.Set("Idempotency-Key", p.IdempotencyKey)
	}

	resp, err := c.http.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(io.LimitReader(resp.Body, maxResponseBytes))
	if err != nil {
		return nil, err
	}
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("stripe: create session: status %d: %s", resp.StatusCode, body)
	}
	var sess CheckoutSession
	if err := json.Unmarshal(body, &sess); err != nil {
		return nil, fmt.Errorf("stripe: decode session: %w", err)
	}
	if sess.URL == "" {
		return nil, errors.New("stripe: empty checkout url")
	}
	return &sess, nil
}

// --- webhooks ---

// Event is the minimal webhook envelope we consume.
type Event struct {
	ID   string `json:"id"`
	Type string `json:"type"`
	Data struct {
		Object json.RawMessage `json:"object"`
	} `json:"data"`
}

// CheckoutSessionObject is event.data.object for checkout.session.completed.
type CheckoutSessionObject struct {
	ID                string `json:"id"`
	ClientReferenceID string `json:"client_reference_id"`
	PaymentStatus     string `json:"payment_status"`
	AmountTotal       int64  `json:"amount_total"`
	Currency          string `json:"currency"`
}

// VerifyWebhook verifies the Stripe-Signature header over payload with secret
// and returns the parsed event. It rejects stale timestamps and uses a
// constant-time comparison.
func VerifyWebhook(payload []byte, sigHeader, secret string) (*Event, error) {
	ts, sigs := parseSignatureHeader(sigHeader)
	if ts == 0 || len(sigs) == 0 {
		return nil, ErrInvalidSignature
	}
	if d := time.Since(time.Unix(ts, 0)); d < -webhookTolerance || d > webhookTolerance {
		return nil, ErrInvalidSignature
	}

	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(strconv.FormatInt(ts, 10)))
	mac.Write([]byte("."))
	mac.Write(payload)
	expected := mac.Sum(nil)

	for _, s := range sigs {
		got, err := hex.DecodeString(s)
		if err != nil {
			continue
		}
		if hmac.Equal(got, expected) {
			var ev Event
			if err := json.Unmarshal(payload, &ev); err != nil {
				return nil, fmt.Errorf("decode event: %w", err)
			}
			return &ev, nil
		}
	}
	return nil, ErrInvalidSignature
}

// parseSignatureHeader parses a "t=...,v1=...,v1=..." Stripe-Signature header.
func parseSignatureHeader(h string) (ts int64, sigs []string) {
	for _, part := range strings.Split(h, ",") {
		k, v, ok := strings.Cut(strings.TrimSpace(part), "=")
		if !ok {
			continue
		}
		switch k {
		case "t":
			ts, _ = strconv.ParseInt(v, 10, 64)
		case "v1":
			sigs = append(sigs, v)
		}
	}
	return ts, sigs
}
