// Package db opens the SQLite database with WAL mode and safe pragmas, and
// applies the embedded schema on startup. Queries live in the domain packages
// (auth, store, payment); this package only owns connection setup + migration.
package db

import (
	"context"
	"database/sql"
	_ "embed"
	"errors"
	"fmt"
	"net/url"
	"time"

	"modernc.org/sqlite" // pure-Go driver (no cgo) -> fully static binary
	sqlitelib "modernc.org/sqlite/lib"
)

//go:embed schema.sql
var schema string

// Open opens (creating if needed) the SQLite database at path, configures
// connection pragmas, and applies the schema. The returned *sql.DB is safe for
// concurrent use.
func Open(path string) (*sql.DB, error) {
	// Pragmas are set per-connection via the DSN so every pooled connection is
	// consistent. WAL is a database-level setting (persists in the file);
	// busy_timeout + foreign_keys + synchronous are per-connection.
	dsn := "file:" + path + "?" + url.Values{
		"_pragma": {
			"journal_mode(WAL)",
			"busy_timeout(5000)",
			"foreign_keys(ON)",
			"synchronous(NORMAL)",
		},
	}.Encode()

	pool, err := sql.Open("sqlite", dsn)
	if err != nil {
		return nil, fmt.Errorf("open sqlite: %w", err)
	}
	// SQLite allows one writer at a time; a small pool plus busy_timeout keeps
	// writes from erroring under contention while still permitting WAL readers.
	pool.SetMaxOpenConns(8)
	pool.SetConnMaxIdleTime(5 * time.Minute)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := pool.PingContext(ctx); err != nil {
		pool.Close()
		return nil, fmt.Errorf("ping sqlite: %w", err)
	}
	if _, err := pool.ExecContext(ctx, schema); err != nil {
		pool.Close()
		return nil, fmt.Errorf("apply schema: %w", err)
	}
	return pool, nil
}

// IsUniqueViolation reports whether err is a SQLite UNIQUE/PRIMARY KEY
// constraint failure. Keeping this driver-specific check here lets callers
// stay decoupled from the sqlite package.
func IsUniqueViolation(err error) bool {
	var serr *sqlite.Error
	if errors.As(err, &serr) {
		code := serr.Code()
		return code == sqlitelib.SQLITE_CONSTRAINT_UNIQUE ||
			code == sqlitelib.SQLITE_CONSTRAINT_PRIMARYKEY
	}
	return false
}
