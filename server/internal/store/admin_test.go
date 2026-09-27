package store

import "testing"

func TestPhysicalListingMustRemainInactive(t *testing.T) {
	active := true
	in := adminProductInput{SKU: "poster", Title: "Poster", PriceCents: 1000, Currency: "usd", Kind: "physical", Active: &active}
	if _, err := validateAdminProductInput(in, true); err == nil {
		t.Fatal("active physical listing should be rejected")
	}
	active = false
	if _, err := validateAdminProductInput(in, true); err != nil {
		t.Fatalf("inactive physical draft should be allowed: %v", err)
	}
}
