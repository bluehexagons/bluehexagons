// Package httpx holds small HTTP helpers shared by the handlers: JSON
// responses, a typed API error, and strict request decoding with a size limit.
// Keeping these here means handlers stay short and consistent.
package httpx

import (
	"encoding/json"
	"errors"
	"io"
	"log/slog"
	"net/http"
)

// maxBodyBytes caps request bodies to bound memory and reject abuse.
const maxBodyBytes = 1 << 20 // 1 MiB

// Error is an API error carrying an HTTP status. Handlers return it; WriteError
// renders it. Unknown errors are rendered as a generic 500 to avoid leaking
// internal detail to clients.
type Error struct {
	Status  int    `json:"-"`
	Message string `json:"error"`
}

func (e *Error) Error() string { return e.Message }

// Errorf builds an *Error with the given status and client-safe message.
func Errorf(status int, msg string) *Error { return &Error{Status: status, Message: msg} }

// HandlerFunc is an http handler that returns an error for centralized
// rendering and logging. Adapt it with Logged.
type HandlerFunc func(http.ResponseWriter, *http.Request) error

// Logged adapts an error-returning handler to http.HandlerFunc. Unexpected
// (non-*Error) failures are logged with request context; all errors are
// rendered via WriteError so clients never see internal detail.
func Logged(log *slog.Logger, fn HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := fn(w, r)
		if err == nil {
			return
		}
		var apiErr *Error
		if !errors.As(err, &apiErr) {
			log.Error("request failed", "method", r.Method, "path", r.URL.Path, "err", err)
		}
		WriteError(w, err)
	}
}

// WriteJSON writes v as JSON with the given status code. A nil v writes only
// the status (and headers).
func WriteJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("X-Content-Type-Options", "nosniff")
	w.WriteHeader(status)
	if v != nil {
		_ = json.NewEncoder(w).Encode(v)
	}
}

// WriteError renders err. *Error values are rendered with their status and
// message; anything else becomes a generic 500.
func WriteError(w http.ResponseWriter, err error) {
	var apiErr *Error
	if errors.As(err, &apiErr) {
		WriteJSON(w, apiErr.Status, apiErr)
		return
	}
	WriteJSON(w, http.StatusInternalServerError, &Error{Message: "internal error"})
}

// DecodeJSON strictly decodes the request body into v: it enforces a size
// limit, rejects unknown fields, and requires exactly one JSON value. It
// returns a 400 *Error on malformed input.
func DecodeJSON(w http.ResponseWriter, r *http.Request, v any) error {
	r.Body = http.MaxBytesReader(w, r.Body, maxBodyBytes)
	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()
	if err := dec.Decode(v); err != nil {
		return Errorf(http.StatusBadRequest, "invalid request body")
	}
	var extra any
	if err := dec.Decode(&extra); !errors.Is(err, io.EOF) {
		return Errorf(http.StatusBadRequest, "request body must contain a single JSON value")
	}
	return nil
}
