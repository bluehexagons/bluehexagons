package auth

import (
	"context"
	"crypto/rand"
	"database/sql"
	"encoding/base64"
	"net/http"
	"time"
)

const (
	sessionCookie   = "bx_session"
	sessionTokenLen = 32 // 256 bits of entropy
	sessionTTL      = 30 * 24 * time.Hour
)

// newToken returns a URL-safe random session token.
func newToken() (string, error) {
	b := make([]byte, sessionTokenLen)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return base64.RawURLEncoding.EncodeToString(b), nil
}

// createSession inserts a fresh session for userID and returns its token and
// expiry.
func createSession(ctx context.Context, db *sql.DB, userID int64) (string, time.Time, error) {
	token, err := newToken()
	if err != nil {
		return "", time.Time{}, err
	}
	now := time.Now()
	exp := now.Add(sessionTTL)
	if _, err := db.ExecContext(ctx,
		`INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)`,
		token, userID, now.Unix(), exp.Unix()); err != nil {
		return "", time.Time{}, err
	}
	return token, exp, nil
}

// lookupSession returns the user id for a valid, unexpired token. Expired
// sessions are deleted opportunistically.
func lookupSession(ctx context.Context, db *sql.DB, token string) (int64, bool, error) {
	var userID, expires int64
	err := db.QueryRowContext(ctx,
		`SELECT user_id, expires_at FROM sessions WHERE token = ?`, token).Scan(&userID, &expires)
	if err == sql.ErrNoRows {
		return 0, false, nil
	}
	if err != nil {
		return 0, false, err
	}
	if time.Now().Unix() >= expires {
		_, _ = db.ExecContext(ctx, `DELETE FROM sessions WHERE token = ?`, token)
		return 0, false, nil
	}
	return userID, true, nil
}

func deleteSession(ctx context.Context, db *sql.DB, token string) error {
	_, err := db.ExecContext(ctx, `DELETE FROM sessions WHERE token = ?`, token)
	return err
}

func (h *Handler) setSessionCookie(w http.ResponseWriter, token string, expires time.Time) {
	http.SetCookie(w, &http.Cookie{
		Name:     sessionCookie,
		Value:    token,
		Path:     "/",
		Expires:  expires,
		HttpOnly: true,
		Secure:   h.cfg.CookieSecure,
		SameSite: http.SameSiteLaxMode,
	})
}

func (h *Handler) clearSessionCookie(w http.ResponseWriter) {
	http.SetCookie(w, &http.Cookie{
		Name:     sessionCookie,
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   h.cfg.CookieSecure,
		SameSite: http.SameSiteLaxMode,
	})
}
