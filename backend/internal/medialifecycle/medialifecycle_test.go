package medialifecycle_test

import (
	"encoding/json"
	"testing"

	"github.com/iskcongoa/margao/internal/medialifecycle"
)

func TestExtractMediaIDsFromContent(t *testing.T) {
	id1 := "00000000-0000-0000-0000-000000000001"
	id2 := "00000000-0000-0000-0000-000000000002"
	id3 := "00000000-0000-0000-0000-000000000003"

	content := json.RawMessage(`[
		{"type":"paragraph","text":"Hello"},
		{"type":"image","mediaId":"` + id1 + `"},
		{"type":"split","mediaId":"` + id2 + `"},
		{"type":"gallery","mediaIds":["` + id3 + `", "` + id1 + `"]},
		{"type":"gallery","images":[{"mediaId":"` + id2 + `"}]}
	]`)

	ids := medialifecycle.ExtractMediaIDsFromContent(content)

	if len(ids) != 3 {
		t.Fatalf("expected 3 unique IDs, got %d", len(ids))
	}

	expected := map[string]bool{id1: true, id2: true, id3: true}
	for _, id := range ids {
		if !expected[id] {
			t.Errorf("unexpected ID %s in output", id)
		}
	}
}
