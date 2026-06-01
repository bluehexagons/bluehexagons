package httpx

import (
	"net/http/httptest"
	"strings"
	"testing"
)

func TestDecodeJSONRequiresSingleValue(t *testing.T) {
	tests := []struct {
		name    string
		body    string
		wantErr bool
	}{
		{name: "single value", body: `{"name":"ok"}`, wantErr: false},
		{name: "single value with whitespace", body: `{"name":"ok"}   `, wantErr: false},
		{name: "concatenated objects", body: `{"name":"ok"}{"name":"extra"}`, wantErr: true},
		{name: "concatenated scalar", body: `{"name":"ok"} true`, wantErr: true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest("POST", "/", strings.NewReader(tt.body))
			rec := httptest.NewRecorder()
			var got struct {
				Name string `json:"name"`
			}

			err := DecodeJSON(rec, req, &got)
			if tt.wantErr && err == nil {
				t.Fatal("DecodeJSON returned nil error, want error")
			}
			if !tt.wantErr && err != nil {
				t.Fatalf("DecodeJSON returned error: %v", err)
			}
		})
	}
}
