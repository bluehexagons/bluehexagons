package auth

import "testing"

func TestHashVerifyRoundTrip(t *testing.T) {
	hash, err := HashPassword("correct horse battery staple")
	if err != nil {
		t.Fatalf("hash: %v", err)
	}
	ok, err := VerifyPassword("correct horse battery staple", hash)
	if err != nil || !ok {
		t.Fatalf("verify correct: ok=%v err=%v", ok, err)
	}
	ok, err = VerifyPassword("wrong password", hash)
	if err != nil {
		t.Fatalf("verify wrong: unexpected err %v", err)
	}
	if ok {
		t.Fatal("verify wrong: expected mismatch")
	}
}

func TestHashesAreSalted(t *testing.T) {
	a, _ := HashPassword("same")
	b, _ := HashPassword("same")
	if a == b {
		t.Fatal("expected distinct hashes for identical passwords (random salt)")
	}
}

func TestVerifyMalformedHash(t *testing.T) {
	for _, bad := range []string{"", "notahash", "$argon2id$bogus", "$bcrypt$v=19$x$y$z"} {
		if _, err := VerifyPassword("x", bad); err == nil {
			t.Errorf("expected error for malformed hash %q", bad)
		}
	}
}
