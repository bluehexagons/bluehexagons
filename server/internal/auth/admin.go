package auth

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"bluehexagons.com/server/internal/config"
)

func EnsureConfiguredAdmins(ctx context.Context, database *sql.DB, cfg config.Config) error {
	for _, email := range cfg.ConfiguredAdminEmails() {
		if err := grantConfiguredAdminEmail(ctx, database, email); err != nil {
			return err
		}
	}
	return nil
}

func UserIsAdmin(ctx context.Context, database *sql.DB, _ config.Config, userID int64) (bool, error) {
	var exists int
	err := database.QueryRowContext(ctx, `SELECT 1 FROM admin_users WHERE user_id = ?`, userID).Scan(&exists)
	if errors.Is(err, sql.ErrNoRows) {
		return false, nil
	}
	if err != nil {
		return false, err
	}
	return true, nil
}

func grantConfiguredAdminEmail(ctx context.Context, database *sql.DB, email string) error {
	var userID int64
	err := database.QueryRowContext(ctx, `SELECT id FROM users WHERE email = ?`, email).Scan(&userID)
	if errors.Is(err, sql.ErrNoRows) {
		return nil
	}
	if err != nil {
		return err
	}
	return grantConfiguredAdmin(ctx, database, userID, email)
}

func grantConfiguredAdmin(ctx context.Context, database *sql.DB, userID int64, email string) error {
	_, err := database.ExecContext(ctx,
		`INSERT INTO admin_users (user_id, email, source, granted_at)
		 VALUES (?, ?, 'configured', ?)
		 ON CONFLICT(user_id) DO UPDATE SET
		 email = excluded.email`,
		userID, email, time.Now().Unix())
	return err
}
