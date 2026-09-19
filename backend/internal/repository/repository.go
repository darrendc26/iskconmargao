package repository

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// Repository encapsulates database access for all domains
type Repository struct {
	pool *pgxpool.Pool
}

// New creates a new Repository instance
func New(pool *pgxpool.Pool) *Repository {
	return &Repository{pool: pool}
}

// DB returns the underlying connection pool
func (r *Repository) DB() *pgxpool.Pool {
	return r.pool
}

// ExecTx executes a function within a database transaction
func (r *Repository) ExecTx(ctx context.Context, fn func(pgx.Tx) error) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer func() {
		_ = tx.Rollback(ctx)
	}()

	if err := fn(tx); err != nil {
		return err
	}
	return tx.Commit(ctx)
}
