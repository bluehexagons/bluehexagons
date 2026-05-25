// Command server is the bluehexagons shop/account API: a single static binary
// with no runtime dependencies. It serves a JSON API under /api and is meant to
// run behind a TLS-terminating reverse proxy (see deploy/).
package main

import (
	"context"
	"database/sql"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"bluehexagons.com/server/internal/auth"
	"bluehexagons.com/server/internal/config"
	"bluehexagons.com/server/internal/db"
	"bluehexagons.com/server/internal/httpx"
	"bluehexagons.com/server/internal/middleware"
	"bluehexagons.com/server/internal/payment"
	"bluehexagons.com/server/internal/store"
)

func main() {
	logger := slog.New(slog.NewTextHandler(os.Stderr, nil))
	if err := run(logger); err != nil {
		logger.Error("fatal", "err", err)
		os.Exit(1)
	}
}

func run(logger *slog.Logger) error {
	cfg := config.Load()

	database, err := db.Open(cfg.DBPath)
	if err != nil {
		return err
	}
	defer database.Close()

	if os.Getenv("SEED_DEMO") == "1" {
		seedCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		if err := store.SeedDemo(seedCtx, database); err != nil {
			logger.Error("seed demo products", "err", err)
		}
		cancel()
	}

	payClient := payment.NewClient(cfg.StripeSecretKey)
	handler := newRouter(database, cfg, logger, payClient)

	srv := &http.Server{
		Addr:              cfg.ListenAddr,
		Handler:           handler,
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       15 * time.Second,
		WriteTimeout:      15 * time.Second,
		IdleTimeout:       60 * time.Second,
		MaxHeaderBytes:    1 << 16,
	}

	errCh := make(chan error, 1)
	go func() {
		logger.Info("listening", "addr", cfg.ListenAddr)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			errCh <- err
		}
	}()

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	select {
	case err := <-errCh:
		return err
	case <-ctx.Done():
		logger.Info("shutting down")
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		return srv.Shutdown(shutdownCtx)
	}
}

// newRouter wires the API routes and global middleware. Shared by run and tests
// so they exercise the same handler chain.
func newRouter(database *sql.DB, cfg config.Config, logger *slog.Logger, pay store.CheckoutGateway) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/health", func(w http.ResponseWriter, r *http.Request) {
		if err := database.PingContext(r.Context()); err != nil {
			httpx.WriteError(w, httpx.Errorf(http.StatusServiceUnavailable, "database unavailable"))
			return
		}
		httpx.WriteJSON(w, http.StatusOK, map[string]string{"status": "ok"})
	})

	authHandler := auth.NewHandler(database, cfg, logger)
	authHandler.Routes(mux)

	store.NewHandler(database, cfg, logger, pay, authHandler.RequireUser).Routes(mux)

	// Applied outermost-first: recover panics, then CORS (answers preflight),
	// then the Origin/CSRF guard, then the router.
	var handler http.Handler = mux
	handler = middleware.OriginCheck(cfg.FrontendOrigin)(handler)
	handler = middleware.CORS(cfg.FrontendOrigin)(handler)
	handler = middleware.Recover(logger)(handler)
	return handler
}
