// Package auth implements the account system: argon2id password hashing,
// opaque server-side sessions stored in SQLite, and the register/login/logout/
// me endpoints plus a RequireUser middleware. It is self-contained so it can be
// audited independently of the rest of the server.
package auth

import (
	"context"
	"crypto/subtle"
	"database/sql"
	"errors"
	"log/slog"
	"net/http"
	"net/mail"
	"strings"
	"time"

	"bluehexagons.com/server/internal/config"
	"bluehexagons.com/server/internal/db"
	"bluehexagons.com/server/internal/httpx"
	"bluehexagons.com/server/internal/middleware"
)

const (
	minPasswordLen = 8
	maxPasswordLen = 256 // bound argon2 work and reject absurd inputs
	maxEmailLen    = 254
)

// dummyHash equalizes login timing for unknown emails (mitigates account
// enumeration). Computed once at startup.
var dummyHash, _ = HashPassword("not-a-real-password-timing-equalizer")

// Handler holds the dependencies for the auth endpoints.
type Handler struct {
	db      *sql.DB
	cfg     config.Config
	log     *slog.Logger
	limiter *middleware.RateLimiter // throttles credential endpoints per IP
}

func NewHandler(database *sql.DB, cfg config.Config, log *slog.Logger) *Handler {
	return &Handler{
		db:  database,
		cfg: cfg,
		log: log,
		// ~10 quick attempts, then one every 5s per IP. Slows brute force and
		// bounds the cost of argon2 hashing.
		limiter: middleware.NewRateLimiter(0.2, 10),
	}
}

// Routes registers the auth endpoints. Credential endpoints are rate-limited;
// /api/me is gated by RequireUser.
func (h *Handler) Routes(mux *http.ServeMux) {
	limit := h.limiter.Limit
	mux.Handle("POST /api/register", limit(httpx.Logged(h.log, h.register)))
	mux.Handle("POST /api/login", limit(httpx.Logged(h.log, h.login)))
	mux.HandleFunc("POST /api/logout", httpx.Logged(h.log, h.logout))
	mux.Handle("GET /api/me", h.RequireUser(httpx.Logged(h.log, h.me)))
}

type credentials struct {
	Email      string `json:"email"`
	Password   string `json:"password"`
	AdminToken string `json:"admin_token,omitempty"`
}

type userResponse struct {
	ID      int64  `json:"id"`
	Email   string `json:"email"`
	IsAdmin bool   `json:"is_admin"`
}

func (h *Handler) register(w http.ResponseWriter, r *http.Request) error {
	var in credentials
	if err := httpx.DecodeJSON(w, r, &in); err != nil {
		return err
	}
	email, err := normalizeEmail(in.Email)
	if err != nil {
		return err
	}
	if len(in.Password) < minPasswordLen || len(in.Password) > maxPasswordLen {
		return httpx.Errorf(http.StatusBadRequest, "password must be 8–256 characters")
	}
	if err := h.requireAdminSignupToken(email, in.AdminToken); err != nil {
		return err
	}
	hash, err := HashPassword(in.Password)
	if err != nil {
		return err
	}
	res, err := h.db.ExecContext(r.Context(),
		`INSERT INTO users (email, password_hash, created_at) VALUES (?, ?, ?)`,
		email, hash, time.Now().Unix())
	if err != nil {
		if db.IsUniqueViolation(err) {
			return httpx.Errorf(http.StatusConflict, "email already registered")
		}
		return err
	}
	userID, _ := res.LastInsertId()
	if h.cfg.IsAdminEmail(email) {
		if err := grantConfiguredAdmin(r.Context(), h.db, userID, email); err != nil {
			return err
		}
	}
	return h.startSession(w, r, userID, email)
}

func (h *Handler) login(w http.ResponseWriter, r *http.Request) error {
	var in credentials
	if err := httpx.DecodeJSON(w, r, &in); err != nil {
		return err
	}
	email, err := normalizeEmail(in.Email)
	if err != nil {
		return httpx.Errorf(http.StatusUnauthorized, "invalid email or password")
	}
	if len(in.Password) > maxPasswordLen {
		return httpx.Errorf(http.StatusUnauthorized, "invalid email or password")
	}
	var userID int64
	var hash string
	err = h.db.QueryRowContext(r.Context(),
		`SELECT id, password_hash FROM users WHERE email = ?`, email).Scan(&userID, &hash)
	if errors.Is(err, sql.ErrNoRows) {
		_, _ = VerifyPassword(in.Password, dummyHash) // equalize timing
		return httpx.Errorf(http.StatusUnauthorized, "invalid email or password")
	}
	if err != nil {
		return err
	}
	ok, err := VerifyPassword(in.Password, hash)
	if err != nil {
		return err
	}
	if !ok {
		return httpx.Errorf(http.StatusUnauthorized, "invalid email or password")
	}
	return h.startSession(w, r, userID, email)
}

func (h *Handler) logout(w http.ResponseWriter, r *http.Request) error {
	if c, err := r.Cookie(sessionCookie); err == nil {
		_ = deleteSession(r.Context(), h.db, c.Value)
	}
	h.clearSessionCookie(w)
	httpx.WriteJSON(w, http.StatusOK, map[string]string{"status": "ok"})
	return nil
}

func (h *Handler) me(w http.ResponseWriter, r *http.Request) error {
	uid, ok := UserID(r.Context())
	if !ok {
		return httpx.Errorf(http.StatusUnauthorized, "not authenticated")
	}
	var email string
	err := h.db.QueryRowContext(r.Context(),
		`SELECT email FROM users WHERE id = ?`, uid).Scan(&email)
	if errors.Is(err, sql.ErrNoRows) {
		return httpx.Errorf(http.StatusUnauthorized, "not authenticated")
	}
	if err != nil {
		return err
	}
	isAdmin, err := UserIsAdmin(r.Context(), h.db, h.cfg, uid)
	if err != nil {
		return err
	}
	httpx.WriteJSON(w, http.StatusOK, userResponse{ID: uid, Email: email, IsAdmin: isAdmin})
	return nil
}

func (h *Handler) startSession(w http.ResponseWriter, r *http.Request, userID int64, email string) error {
	token, exp, err := createSession(r.Context(), h.db, userID)
	if err != nil {
		return err
	}
	isAdmin, err := UserIsAdmin(r.Context(), h.db, h.cfg, userID)
	if err != nil {
		return err
	}
	h.setSessionCookie(w, token, exp)
	httpx.WriteJSON(w, http.StatusOK, userResponse{ID: userID, Email: email, IsAdmin: isAdmin})
	return nil
}

func (h *Handler) requireAdminSignupToken(email, token string) error {
	if !h.cfg.IsAdminEmail(email) {
		return nil
	}
	if h.cfg.AdminSignupToken == "" {
		return httpx.Errorf(http.StatusBadRequest, "admin signup token is not configured")
	}
	if subtle.ConstantTimeCompare([]byte(token), []byte(h.cfg.AdminSignupToken)) != 1 {
		return httpx.Errorf(http.StatusUnauthorized, "invalid admin signup token")
	}
	return nil
}

func normalizeEmail(raw string) (string, error) {
	raw = strings.TrimSpace(raw)
	if raw == "" || len(raw) > maxEmailLen {
		return "", httpx.Errorf(http.StatusBadRequest, "invalid email")
	}
	addr, err := mail.ParseAddress(raw)
	if err != nil {
		return "", httpx.Errorf(http.StatusBadRequest, "invalid email")
	}
	return strings.ToLower(addr.Address), nil
}

// --- request-scoped user identity ---

type ctxKey int

const userIDKey ctxKey = iota

// RequireUser is middleware that requires a valid session cookie and stores the
// authenticated user id in the request context (read it with UserID).
func (h *Handler) RequireUser(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		c, err := r.Cookie(sessionCookie)
		if err != nil {
			httpx.WriteError(w, httpx.Errorf(http.StatusUnauthorized, "not authenticated"))
			return
		}
		uid, ok, err := lookupSession(r.Context(), h.db, c.Value)
		if err != nil {
			h.log.Error("session lookup", "err", err)
			httpx.WriteError(w, httpx.Errorf(http.StatusInternalServerError, "internal error"))
			return
		}
		if !ok {
			httpx.WriteError(w, httpx.Errorf(http.StatusUnauthorized, "not authenticated"))
			return
		}
		next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), userIDKey, uid)))
	})
}

// UserID returns the authenticated user id stored by RequireUser.
func UserID(ctx context.Context) (int64, bool) {
	uid, ok := ctx.Value(userIDKey).(int64)
	return uid, ok
}
