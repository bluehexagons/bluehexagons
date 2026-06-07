package middleware

import (
	"net/http"
	"testing"
)

func TestClientIPTrustsForwardedForFromLoopback(t *testing.T) {
	r := &http.Request{
		RemoteAddr: "127.0.0.1:12345",
		Header: http.Header{
			"X-Forwarded-For": []string{"203.0.113.10, 10.0.0.2"},
		},
	}
	if got := clientIP(r); got != "203.0.113.10" {
		t.Fatalf("clientIP = %q, want forwarded client", got)
	}
}

func TestClientIPIgnoresForwardedForFromRemotePeer(t *testing.T) {
	r := &http.Request{
		RemoteAddr: "198.51.100.4:12345",
		Header: http.Header{
			"X-Forwarded-For": []string{"203.0.113.10"},
		},
	}
	if got := clientIP(r); got != "198.51.100.4" {
		t.Fatalf("clientIP = %q, want direct peer", got)
	}
}
