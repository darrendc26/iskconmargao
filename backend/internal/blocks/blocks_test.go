package blocks

import (
	"context"
	"encoding/json"
	"testing"
)

func TestValidateArticleContent(t *testing.T) {
	ctx := context.Background()

	tests := []struct {
		name    string
		json    string
		wantErr bool
	}{
		{
			name:    "1. Valid heading block (level 2 & 3)",
			json:    `[{"type":"heading","level":2,"text":"Why Do We Chant?"},{"type":"heading","level":3,"text":"Subheading"}]`,
			wantErr: false,
		},
		{
			name:    "2. Valid paragraph block",
			json:    `[{"type":"paragraph","text":"The Hare Krishna maha-mantra..."}]`,
			wantErr: false,
		},
		{
			name:    "3. Valid image block",
			json:    `[{"type":"image","mediaId":"00000000-0000-0000-0000-000000000001","alt":"Devotees","caption":"Kirtan"}]`,
			wantErr: false,
		},
		{
			name:    "4. Invalid media ID",
			json:    `[{"type":"image","mediaId":"not-a-uuid","alt":"Devotees"}]`,
			wantErr: true,
		},
		{
			name:    "5. Invalid heading level",
			json:    `[{"type":"heading","level":1,"text":"Main Title"}]`,
			wantErr: true,
		},
		{
			name:    "6. Invalid block type",
			json:    `[{"type":"unknown_type","foo":"bar"}]`,
			wantErr: true,
		},
		{
			name:    "7. Invalid image position",
			json:    `[{"type":"split","imagePosition":"center","mediaId":"00000000-0000-0000-0000-000000000001","text":"Sample"}]`,
			wantErr: true,
		},
		{
			name:    "8. Invalid YouTube ID",
			json:    `[{"type":"youtube","videoId":"invalid-url-or-id-too-long-12345"}]`,
			wantErr: true,
		},
		{
			name:    "9. Valid gallery",
			json:    `[{"type":"gallery","mediaIds":["00000000-0000-0000-0000-000000000001","00000000-0000-0000-0000-000000000002"]}]`,
			wantErr: false,
		},
		{
			name:    "10. Malformed JSON",
			json:    `[{"type":"paragraph","text":}`,
			wantErr: true,
		},
		{
			name:    "11. Empty content",
			json:    `[]`,
			wantErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := ValidateArticleContent(ctx, nil, json.RawMessage(tt.json))
			if (err != nil) != tt.wantErr {
				t.Errorf("ValidateArticleContent() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestLegacyArticleContentConversion(t *testing.T) {
	legacyText := "First paragraph of legacy article.\n\nSecond paragraph of legacy article."
	res := ConvertPlainTextToParagraphBlocks(legacyText)

	var blocks []Block
	if err := json.Unmarshal(res, &blocks); err != nil {
		t.Fatalf("Failed to unmarshal converted legacy text: %v", err)
	}

	if len(blocks) != 2 {
		t.Fatalf("Expected 2 paragraph blocks, got %d", len(blocks))
	}

	if blocks[0].Type != "paragraph" || blocks[0].Text != "First paragraph of legacy article." {
		t.Errorf("Unexpected block 0: %+v", blocks[0])
	}
	if blocks[1].Type != "paragraph" || blocks[1].Text != "Second paragraph of legacy article." {
		t.Errorf("Unexpected block 1: %+v", blocks[1])
	}
}
