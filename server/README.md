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
| GET    | `/api/assets/{id}/preview` | none         | Public listing preview asset         |
| GET    | `/api/assets/{id}/download` | session + purchase | Download unlocked asset       |
| GET    | `/api/orders/{id}/deliverables` | session + owner | Post-purchase text/files/keys |
| POST   | `/api/order-items/{id}/claim-key` | session + owner | Claim one deferred key        |
| POST   | `/api/checkout`         | session         | Create order + Stripe Checkout URL   |
| POST   | `/api/webhooks/stripe`  | Stripe signature| Fulfill paid orders (idempotent)     |
| `*`    | `/api/admin/*`          | admin session   | Manage listings, uploads, and keys   |

Admin sessions use the normal account cookie. `SHOP_PRIMARY_ADMIN_EMAIL`
defaults to `loren@bluehexagons.com`; existing users with that exact stored
email are granted admin rights on setup, and future signups/logins with that
email are granted immediately. `SHOP_ADMIN_EMAILS` can add extra comma-separated
admin emails. Uploaded shop assets are stored under `SHOP_UPLOAD_DIR`; preview
assets are public, while download assets require a paid/fulfilled order
containing that product. Admins can also add named external asset links. Linked
download assets redirect to the third-party URL after purchase authorization;
linked preview images are fetched once and converted into local JPEG thumbnails.

## Run locally

```bash
go run .                                   # serves on 127.0.0.1:8080
SEED_DEMO=1 COOKIE_SECURE=false go run .    # with example products, http cookies
SHOP_PRIMARY_ADMIN_EMAIL=you@example.com COOKIE_SECURE=false go run . # enables /shop/admin.html locally
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

The repo-root `infra.json` deploys only the static site by default; it does not
build or install this optional backend. For an explicit backend deployment, use
a service manifest component with `path: "/api"`. In that path infra_tools
installs `deploy/bx-server.service.tmpl` as the systemd unit, substituting
`{{...}}` placeholders at deploy time, and reverse-proxies same-origin `/api` →
`127.0.0.1:8080` via nginx. Specifically it:

- runs the service as a **dedicated, isolated** `--system` user (`app-<app>-shop-api`),
  not a shared deploy user;
- creates and owns a **managed data dir** at
  `/var/www/.infra_tools_shared/<app>/shop-api/data` (the `{{data_dir}}`), which
  persists across deploys; the unit injects `DB_PATH` there and restricts writes
  to it (`ReadWritePaths`);
- reads the operator env file from the managed shared dir
  (`.../shop-api/.env`, the `{{env_file}}`) — secrets live there, never in the repo.

The non-templated `deploy/bx-server.service` and `deploy/Caddyfile` are the
**manual**-path reference (they target `/opt/bx-server`), not used by infra_tools.
Either way, `LISTEN_ADDR` in the env file must match the manifest's `port` (`8080`).

### Backups

SQLite runs in WAL mode. Back up consistently without stopping the service:

```bash
sqlite3 /opt/bx-server/data/bluehexagons.db ".backup '/backup/bx-$(date +%F).db'"
```
