// Package middleware holds small, composable HTTP middleware applied to the
// whole API: CORS for the browser origin, an Origin-based CSRF guard, panic
// recovery, and (in ratelimit.go) a token-bucket rate limiter.
package middleware

import (
	"log/slog"
	"net/http"
	"net/url"
	"runtime/debug"
	"strings"

	"bluehexagons.com/server/internal/httpx"
)

// CORS sets CORS headers for the configured browser origin and answers
// preflight requests. Only the exact allowed origin is echoed (never "*"),
// which is required when credentials (cookies) are sent.
func CORS(allowedOrigin string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			origin := r.Header.Get("Origin")
			if origin != "" && origin == allowedOrigin {
				h := w.Header()
				h.Set("Access-Control-Allow-Origin", allowedOrigin)
				h.Set("Access-Control-Allow-Credentials", "true")
				h.Add("Vary", "Origin")
				if r.Method == http.MethodOptions {
					h.Set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
					h.Set("Access-Control-Allow-Headers", "Content-Type")
					h.Set("Access-Control-Max-Age", "600")
					w.WriteHeader(http.StatusNoContent)
					return
				}
			} else if r.Method == http.MethodOptions {
				// Preflight from a disallowed origin: answer without CORS headers.
				w.WriteHeader(http.StatusNoContent)
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}

// OriginCheck is defense-in-depth against CSRF: for state-changing browser
// requests it requires either a matching Origin or same-origin Referer.
// SameSite=Lax cookies already block cross-site sends; this is a second layer.
// Webhook paths are exempt — they are server-to-server, signature-authenticated,
// and carry no Origin header.
func OriginCheck(allowedOrigin string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if isStateChanging(r.Method) && !strings.HasPrefix(r.URL.Path, "/api/webhooks/") {
				origin := r.Header.Get("Origin")
				if origin == allowedOrigin || (origin == "" && sameOriginReferer(r.Header.Get("Referer"), allowedOrigin)) {
					next.ServeHTTP(w, r)
					return
				}
				if origin != "" || r.Header.Get("Referer") != "" {
					httpx.WriteError(w, httpx.Errorf(http.StatusForbidden, "cross-origin request rejected"))
					return
				}
				httpx.WriteError(w, httpx.Errorf(http.StatusForbidden, "same-origin request required"))
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}

func sameOriginReferer(referer, allowedOrigin string) bool {
	if referer == "" || allowedOrigin == "" {
		return false
	}
	u, err := url.Parse(referer)
	if err != nil || u.Scheme == "" || u.Host == "" {
		return false
	}
	return u.Scheme+"://"+u.Host == allowedOrigin
}

// Recover converts panics into 500s and logs the stack, so a single bad request
// cannot crash the server.
func Recover(log *slog.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			defer func() {
				if rec := recover(); rec != nil {
					log.Error("panic recovered", "err", rec, "stack", string(debug.Stack()))
					httpx.WriteError(w, httpx.Errorf(http.StatusInternalServerError, "internal error"))
				}
			}()
			next.ServeHTTP(w, r)
		})
	}
}

func isStateChanging(method string) bool {
	switch method {
	case http.MethodPost, http.MethodPut, http.MethodPatch, http.MethodDelete:
		return true
	}
	return false
}
