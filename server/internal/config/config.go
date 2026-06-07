// Package config loads server configuration from the environment. No config
// file or library: every value comes from an env var with a sensible default,
// except secrets, which are intentionally empty until set.
package config

import (
	"os"
	"strings"
)

const DefaultPrimaryAdminEmail = "loren@bluehexagons.com"

type Config struct {
	ListenAddr     string // host:port to bind, e.g. 127.0.0.1:8080 (front with a TLS proxy)
	DBPath         string // SQLite file path
	BaseURL        string // public base URL of this API (Stripe redirect/return URLs)
	FrontendOrigin string // allowed browser origin for CORS, e.g. https://bluehexagons.com

	StripeSecretKey     string              // sk_... (required only for checkout)
	StripeWebhookSecret string              // whsec_... (required only for the webhook)
	PrimaryAdminEmail   string              // configured bootstrap admin account email
	AdminEmails         map[string]struct{} // lower-case emails allowed into /api/admin
	UploadDir           string              // local private storage for shop assets

	CookieSecure bool // mark session cookies Secure (disable only for local http dev)
}

// Load reads configuration from the environment. It never fails; subsystems
// validate the secrets they need at the point of use so the server can boot
// (and serve the catalog/health) even before payments are configured.
func Load() Config {
	return Config{
		ListenAddr:          env("LISTEN_ADDR", "127.0.0.1:8080"),
		DBPath:              env("DB_PATH", "bluehexagons.db"),
		BaseURL:             env("BASE_URL", "http://localhost:8080"),
		FrontendOrigin:      env("FRONTEND_ORIGIN", "http://localhost:3000"),
		StripeSecretKey:     os.Getenv("STRIPE_SECRET_KEY"),
		StripeWebhookSecret: os.Getenv("STRIPE_WEBHOOK_SECRET"),
		PrimaryAdminEmail:   normalizeEmail(env("SHOP_PRIMARY_ADMIN_EMAIL", DefaultPrimaryAdminEmail)),
		AdminEmails:         parseAdminEmails(os.Getenv("SHOP_ADMIN_EMAILS")),
		UploadDir:           env("SHOP_UPLOAD_DIR", "shop_uploads"),
		CookieSecure:        env("COOKIE_SECURE", "true") != "false",
	}
}

func (c Config) IsAdminEmail(email string) bool {
	email = normalizeEmail(email)
	if email == "" {
		return false
	}
	if c.PrimaryAdminEmail != "" && email == normalizeEmail(c.PrimaryAdminEmail) {
		return true
	}
	_, ok := c.AdminEmails[email]
	return ok
}

func (c Config) ConfiguredAdminEmails() []string {
	seen := map[string]struct{}{}
	emails := []string{}
	for _, email := range append([]string{c.PrimaryAdminEmail}, keys(c.AdminEmails)...) {
		email = normalizeEmail(email)
		if email == "" {
			continue
		}
		if _, ok := seen[email]; ok {
			continue
		}
		seen[email] = struct{}{}
		emails = append(emails, email)
	}
	return emails
}

func (c Config) ShopUploadDir() string {
	if c.UploadDir != "" {
		return c.UploadDir
	}
	return "shop_uploads"
}

func env(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

func parseAdminEmails(raw string) map[string]struct{} {
	admins := map[string]struct{}{}
	for _, part := range strings.Split(raw, ",") {
		email := normalizeEmail(part)
		if email != "" {
			admins[email] = struct{}{}
		}
	}
	return admins
}

func normalizeEmail(raw string) string {
	return strings.ToLower(strings.TrimSpace(raw))
}

func keys(m map[string]struct{}) []string {
	out := make([]string, 0, len(m))
	for k := range m {
		out = append(out, k)
	}
	return out
}
