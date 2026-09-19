package storage

import (
	"context"
	"io"
	"time"
)

type ObjectStorage interface {
	Upload(ctx context.Context, key string, body io.Reader, contentType string) error
	Delete(ctx context.Context, key string) error
	GetURL(key string) string
	Exists(ctx context.Context, key string) (bool, error)
	Get(ctx context.Context, key string) (io.ReadCloser, error)
	PresignPut(ctx context.Context, key, contentType string, expiry time.Duration) (string, error)
}
