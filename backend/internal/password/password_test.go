package password

import "testing"

func TestHashVerify(t *testing.T) {
	h, err := Hash("correct-horse")
	if err != nil {
		t.Fatal(err)
	}
	if !Verify("correct-horse", h) {
		t.Fatal("expected match")
	}
	if Verify("wrong", h) {
		t.Fatal("expected mismatch")
	}
}
