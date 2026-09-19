package slugify

import "testing"

func TestSlug(t *testing.T) {
	if Slug("Why do we chant Hare Krishna?") != "why-do-we-chant-hare-krishna" {
		t.Fatal(Slug("Why do we chant Hare Krishna?"))
	}
	if Slug("  Janmashtami 2026 ") != "janmashtami-2026" {
		t.Fatal(Slug("  Janmashtami 2026 "))
	}
}
