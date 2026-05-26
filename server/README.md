# bluehexagons shop/account API

A small, self-contained Go service providing the account system and store for
the bluehexagons site. It compiles to a single static binary with **zero
runtime dependencies** and is meant to be audited independently of the static
frontend.

## Design

- **Standard library first.** HTTP server + routing (`net/http`, Go 1.22+
  method/path `ServeMux`), JSON, crypto, and templating are all stdlib.
- **Two module dependencies**, both compiled into the binary:
  - `modernc.org/sqlite` — pure-Go SQLite driver (no cgo).
  - `golang.org/x/crypto` — argon2id password hashing.
- **Payments without an SDK.** Stripe Checkout is created and webhooks verified
  over Stripe's REST API using only stdlib `net/http` and `crypto/hmac`. Card
  data never touches this server.

## Layout

```
main.go                 config -> db -> mux + global middleware -> serve
internal/
  config/               env-only configuration
  db/                   SQLite open (WAL) + embedded schema + driver helpers
  httpx/                JSON helpers, typed errors, strict request decoding
  middleware/           CORS, Origin/CSRF guard, panic recovery, rate limiter
  auth/                 argon2id, sessions, register/login/logout/me, RequireUser
  payment/              Stripe Checkout + webhook verification (REST, no SDK)
  store/                products, checkout, orders, fulfillment
deploy/                 build script, systemd unit, Caddyfile, .env.example
```

## API

| Method | Path                    | Auth            | Purpose                              |
|--------|-------------------------|-----------------|--------------------------------------|
| GET    | `/api/health`           | none            | Liveness + DB ping                   |
| POST   | `/api/register`         | none (limited)  | Create account, start session        |
| POST   | `/api/login`            | none (limited)  | Start session                        |
| POST   | `/api/logout`           | session         | End session                          |
| GET    | `/api/me`               | session         | Current user                         |
| GET    | `/api/products`         | none            | List active products                 |
| GET    | `/api/products/{id}`    | none            | One product                          |
| POST   | `/api/checkout`         | session         | Create order + Stripe Checkout URL   |
| POST   | `/api/webhooks/stripe`  | Stripe signature| Fulfill paid orders (idempotent)     |

## Run locally

```bash
go run .                                   # serves on 127.0.0.1:8080
SEED_DEMO=1 COOKIE_SECURE=false go run .    # with example products, http cookies
go test ./...                               # unit/handler tests
```

Test Stripe webhooks locally with the Stripe CLI (a dev tool, not a dependency):

```bash
stripe listen --forward-to localhost:8080/api/webhooks/stripe
# use the printed whsec_... as STRIPE_WEBHOOK_SECRET
```

## Deploy (self-hosted VPS)

1. `./deploy/build.sh` → static `bx-server` (verify with `file bx-server`).
2. Copy the binary, `deploy/.env.example` (→ `.env`), and create
   `/opt/bx-server/data`.
3. Install `deploy/bx-server.service`, `systemctl enable --now bx-server`.
4. Put Caddy in front with `deploy/Caddyfile` for automatic HTTPS.

### Automated deploy (infra_tools)

The repo-root `infra.json` lets [infra_tools](../../infra_tools) deploy both the
static site and this service from one `setup ... --deploy` run. In that path
infra_tools **generates** the systemd unit from the manifest (resolved binary
path, `working_dir`, `EnvironmentFile=/opt/bx-server/.env`) and reverse-proxies
`api.bluehexagons.com` → `127.0.0.1:8080` via nginx — so `deploy/bx-server.service`
and `deploy/Caddyfile` here are the manual-path reference, not used by infra_tools.
The service still reads its own config from the env file, so `LISTEN_ADDR` there
must match the manifest's `port` (`8080`).

### Backups

SQLite runs in WAL mode. Back up consistently without stopping the service:

```bash
sqlite3 /opt/bx-server/data/bluehexagons.db ".backup '/backup/bx-$(date +%F).db'"
```
