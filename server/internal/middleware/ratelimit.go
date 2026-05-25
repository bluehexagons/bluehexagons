package middleware

import (
	"net"
	"net/http"
	"sync"
	"time"

	"bluehexagons.com/server/internal/httpx"
)

// RateLimiter is a token-bucket limiter keyed by client IP, safe for concurrent
// use. It is meant for sensitive endpoints (login, register) to slow brute
// force and bound the cost of expensive work like password hashing.
type RateLimiter struct {
	mu       sync.Mutex
	visitors map[string]*bucket
	rate     float64       // tokens added per second
	burst    float64       // bucket capacity
	ttl      time.Duration // idle entries older than this are pruned
}

type bucket struct {
	tokens float64
	last   time.Time
}

// NewRateLimiter returns a limiter allowing burst requests immediately, then
// perSecond sustained. It starts a background pruning goroutine.
func NewRateLimiter(perSecond, burst float64) *RateLimiter {
	rl := &RateLimiter{
		visitors: make(map[string]*bucket),
		rate:     perSecond,
		burst:    burst,
		ttl:      10 * time.Minute,
	}
	go rl.cleanupLoop()
	return rl
}

func (rl *RateLimiter) allow(key string) bool {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	now := time.Now()
	b, ok := rl.visitors[key]
	if !ok {
		rl.visitors[key] = &bucket{tokens: rl.burst - 1, last: now}
		return true
	}
	b.tokens += now.Sub(b.last).Seconds() * rl.rate
	if b.tokens > rl.burst {
		b.tokens = rl.burst
	}
	b.last = now
	if b.tokens < 1 {
		return false
	}
	b.tokens--
	return true
}

func (rl *RateLimiter) cleanupLoop() {
	t := time.NewTicker(rl.ttl)
	defer t.Stop()
	for range t.C {
		rl.mu.Lock()
		cutoff := time.Now().Add(-rl.ttl)
		for k, b := range rl.visitors {
			if b.last.Before(cutoff) {
				delete(rl.visitors, k)
			}
		}
		rl.mu.Unlock()
	}
}

// Limit wraps next, rejecting requests from clients over the rate with 429.
func (rl *RateLimiter) Limit(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !rl.allow(clientIP(r)) {
			httpx.WriteError(w, httpx.Errorf(http.StatusTooManyRequests, "too many requests"))
			return
		}
		next.ServeHTTP(w, r)
	})
}

// clientIP returns the remote IP without the port. Behind a reverse proxy you
// may want to derive this from a trusted X-Forwarded-For instead.
func clientIP(r *http.Request) string {
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return host
}
