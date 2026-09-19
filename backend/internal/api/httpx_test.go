package api

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/iskcongoa/margao/internal/httpx"
)

func TestEnvelopeUnauthorized(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(r)
	httpx.Unauthorized(c)
	if r.Code != http.StatusUnauthorized {
		t.Fatal(r.Code)
	}
	if !strings.Contains(r.Body.String(), "UNAUTHORIZED") {
		t.Fatal(r.Body.String())
	}
}
