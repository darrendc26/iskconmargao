package storage

import (
	"context"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
	"time"
)

type LocalStorage struct {
	Root     string
	PublicURL string
}

func NewLocal(root, publicURL string) *LocalStorage {
	_ = os.MkdirAll(root, 0o755)
	return &LocalStorage{Root: root, PublicURL: publicURL}
}

func (l *LocalStorage) path(key string) string {
	return filepath.Join(l.Root, filepath.FromSlash(key))
}

func (l *LocalStorage) Upload(_ context.Context, key string, body io.Reader, _ string) error {
	p := l.path(key)
	if err := os.MkdirAll(filepath.Dir(p), 0o755); err != nil {
		return err
	}
	f, err := os.Create(p)
	if err != nil {
		return err
	}
	defer f.Close()
	_, err = io.Copy(f, body)
	return err
}

func (l *LocalStorage) Delete(_ context.Context, key string) error {
	return os.Remove(l.path(key))
}

func (l *LocalStorage) GetURL(key string) string {
	cleanKey := strings.TrimPrefix(key, "/")
	return fmt.Sprintf("%s/%s", strings.TrimSuffix(l.PublicURL, "/"), cleanKey)
}

func (l *LocalStorage) Exists(_ context.Context, key string) (bool, error) {
	_, err := os.Stat(l.path(key))
	if os.IsNotExist(err) {
		return false, nil
	}
	return err == nil, err
}

func (l *LocalStorage) Get(_ context.Context, key string) (io.ReadCloser, error) {
	return os.Open(l.path(key))
}

func (l *LocalStorage) PresignPut(_ context.Context, key, _ string, _ time.Duration) (string, error) {
	return "", fmt.Errorf("local storage does not support presign")
}
