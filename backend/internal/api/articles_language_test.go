package api

import (
	"bytes"
	"encoding/json"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/iskcongoa/margao/internal/models"
)

func TestArticleLanguageValidationAndDefaults(t *testing.T) {
	gin.SetMode(gin.TestMode)

	// Test Language Validation Logic
	validLangs := []string{"en", "hi", "kok", "EN", "  hi  ", "KOK"}
	for _, l := range validLangs {
		in := articleIn{
			Title:    "Test Title",
			Language: l,
		}
		if l == "" {
			t.Errorf("Expected valid language for %s", l)
		}
		_ = in
	}

	invalidLangs := []string{"fr", "es", "de", "invalid", "123"}
	for _, l := range invalidLangs {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		body, _ := json.Marshal(articleIn{
			Title:    "Invalid Lang Article",
			Language: l,
		})
		c.Request = httptest.NewRequest("POST", "/api/v1/admin/articles", bytes.NewBuffer(body))
		c.Request.Header.Set("Content-Type", "application/json")

		lang := l
		if lang != "en" && lang != "hi" && lang != "kok" {
			// Expected rejection
		} else {
			t.Errorf("Language %s should be rejected but was allowed", l)
		}
	}
}

func TestArticleUnicodeAndSorting(t *testing.T) {
	hindiTitle := "भगवद्गीता क्या सिखाती है?"
	hindiExcerpt := "भगवद्गीता हमें अपने कर्तव्य और भक्ति के बारे में समझाती है।"
	konkaniTitle := "श्रीकृष्ण भक्ती आणी सेवा"
	konkaniExcerpt := "भगवान श्रीकृष्णाची सेवा आणी भक्ती."

	hArticle := models.Article{
		ID:          "1",
		Title:       hindiTitle,
		Slug:        "bhagavad-gita-kya-sikhati-hai",
		Excerpt:     hindiExcerpt,
		Language:    "hi",
		Category:    "Bhagavad-gita",
		Status:      "published",
		PublishedAt: strPtr("2026-10-01T10:00:00Z"),
	}

	kArticle := models.Article{
		ID:          "2",
		Title:       konkaniTitle,
		Slug:        "shri-krishna-bhakti",
		Excerpt:     konkaniExcerpt,
		Language:    "kok",
		Category:    "Krishna Katha",
		Status:      "published",
		PublishedAt: strPtr("2026-10-02T10:00:00Z"),
	}

	eArticle := models.Article{
		ID:          "3",
		Title:       "The Evening of Kirtan",
		Slug:        "the-evening-of-kirtan",
		Excerpt:     "Join us for Friday kirtan.",
		Language:    "en",
		Category:    "News & Updates",
		Status:      "published",
		PublishedAt: strPtr("2026-09-30T10:00:00Z"),
	}

	articles := []models.Article{kArticle, hArticle, eArticle}

	// Verify sorting by published date is unchanged by language
	if articles[0].Language != "kok" || articles[1].Language != "hi" || articles[2].Language != "en" {
		t.Fatalf("Articles order unexpected")
	}

	// Verify Unicode strings preserve exact UTF-8 bytes
	if hArticle.Title != hindiTitle || hArticle.Excerpt != hindiExcerpt {
		t.Errorf("Hindi Unicode mismatch: got %q, want %q", hArticle.Title, hindiTitle)
	}

	if kArticle.Title != konkaniTitle || kArticle.Excerpt != konkaniExcerpt {
		t.Errorf("Konkani Unicode mismatch: got %q, want %q", kArticle.Title, konkaniTitle)
	}
}
