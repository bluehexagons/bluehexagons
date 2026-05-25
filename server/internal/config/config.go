// Package config loads server configuration from the environment. No config
// file or library: every value comes from an env var with a sensible default,
// except secrets, which are intentionally empty until set.
package config

import "os"

type Config struct {
	ListenAddr     string // host:port to bind, e.g. 127.0.0.1:8080 (front with a TLS proxy)
	DBPath         string // SQLite file path
	BaseURL        string // public base URL of this API (Stripe redirect/return URLs)
	FrontendOrigin string // allowed browser origin for CORS, e.g. https://bluehexagons.com

	StripeSecretKey     string // sk_... (required only for checkout)
	StripeWebhookSecret string // whsec_... (required only for the webhook)

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
		CookieSecure:        env("COOKIE_SECURE", "true") != "false",
	}
}

func env(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}
