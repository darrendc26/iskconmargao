package httpx

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Envelope struct {
	Success bool        `json:"success"`
	Data    any         `json:"data,omitempty"`
	Error   *ErrorBody  `json:"error,omitempty"`
}

type ErrorBody struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

func OK(c *gin.Context, data any) {
	c.JSON(http.StatusOK, Envelope{Success: true, Data: data})
}

func Created(c *gin.Context, data any) {
	c.JSON(http.StatusCreated, Envelope{Success: true, Data: data})
}

func Fail(c *gin.Context, status int, code, message string) {
	c.JSON(status, Envelope{Success: false, Error: &ErrorBody{Code: code, Message: message}})
}

func BadRequest(c *gin.Context, msg string) {
	Fail(c, http.StatusBadRequest, "VALIDATION_ERROR", msg)
}

func Unauthorized(c *gin.Context) {
	Fail(c, http.StatusUnauthorized, "UNAUTHORIZED", "Please sign in.")
}

func Forbidden(c *gin.Context) {
	Fail(c, http.StatusForbidden, "FORBIDDEN", "You do not have permission to do this.")
}

func NotFound(c *gin.Context, msg string) {
	if msg == "" {
		msg = "Not found."
	}
	Fail(c, http.StatusNotFound, "NOT_FOUND", msg)
}

func Conflict(c *gin.Context, msg string) {
	Fail(c, http.StatusConflict, "CONFLICT", msg)
}

func TooMany(c *gin.Context) {
	Fail(c, http.StatusTooManyRequests, "RATE_LIMITED", "Please wait a moment and try again.")
}

func Server(c *gin.Context, msg string) {
	if msg == "" {
		msg = "Something went wrong. Please try again."
	}
	Fail(c, http.StatusInternalServerError, "INTERNAL_ERROR", msg)
}

func ServiceUnavailable(c *gin.Context, code, msg string) {
	Fail(c, http.StatusServiceUnavailable, code, msg)
}
