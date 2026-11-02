# bluehexagons shop/account API

A small, self-contained Go service providing the account system and store for
the bluehexagons site. It compiles to a single static binary with **zero
runtime dependencies** and is meant to be audited independently of the static
frontend.

Requires Go 1.27.3 or newer. Go has no LTS line; development targets the latest stable release.

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
| GET    | `/api/products`         | none            | List active digital products         |
| GET    | `/api/products/{id}`    | none            | One product                          |
| GET    | `/api/assets/{id}/preview` | none         | Public listing preview asset         |
| GET    | `/api/assets/{id}/download` | session + purchase | Download unlocked asset       |
| GET    | `/api/orders/{id}/deliverables` | session + owner | Post-purchase text/files/keys |
| POST   | `/api/order-items/{id}/claim-key` | session + owner | Claim one deferred key        |
| POST   | `/api/checkout`         | session         | Create order + Stripe Checkout URL   |
| POST   | `/api/webhooks/stripe`  | Stripe signature| Fulfill or cancel orders (idempotent)|
| `*`    | `/api/admin/*`          | admin session   | Manage listings, uploads, and keys   |

Admin sessions use the normal account cookie. `SHOP_PRIMARY_ADMIN_EMAIL`
defaults to `loren@bluehexagons.com`; existing users with that exact stored
email are granted admin rights on setup. Creating a configured admin account
through `/shop/admin.html` requires `SHOP_ADMIN_SIGNUP_TOKEN`, which should be
set for bootstrap and removed or rotated after setup. `SHOP_ADMIN_EMAILS` can
add extra comma-separated admin emails. Uploaded shop assets are stored under
`SHOP_UPLOAD_DIR`; preview assets are public, while download assets require a
paid/fulfilled order containing that product. Admins can also add named external
asset links. In production these links must be HTTPS and resolve to public IPs;
`SHOP_ALLOW_UNSAFE_ASSET_URLS=true` is available only for local/private testing.
Linked download assets redirect to the third-party URL after purchase
authorization; linked preview images are fetched once and converted into local
JPEG thumbnails.

Physical products can be saved as inactive drafts, but cannot be published or
checked out until shipping is supported. Prices use Stripe's currency minor
units despite the historical `price_cents` API and database field name. A
key-backed product reserves available key stock for pending and paid orders;
Stripe expiration or failure releases a pending order's stock. Configure the
webhook endpoint for `checkout.session.completed`,
`checkout.session.async_payment_succeeded`,
`checkout.session.async_payment_failed`, and `checkout.session.expired`.

## Run locally

Run these commands from `server/`. Configuration comes from the process
environment; the Go service does not load `.env` files automatically.

```bash
go run .                                   # serves on 127.0.0.1:8080
# Example products and cookies for local HTTP.
SEED_DEMO=1 COOKIE_SECURE=false go run .
```

In another terminal, run `npm ci && npm run dev:shop` from the repository root,
then open `http://localhost:3000/shop/`. The API permits that frontend origin
by default. Stripe return URLs also use `FRONTEND_ORIGIN`; update it if you
change the frontend's host or port.

To bootstrap a local administrator, add
`SHOP_PRIMARY_ADMIN_EMAIL=you@example.com SHOP_ADMIN_SIGNUP_TOKEN=dev-token`
to the API command, then register through `/shop/admin.html` using that email
and token. Local data is saved to `server/bluehexagons.db` and uploads to
`server/shop_uploads/`; both are ignored by Git.

Run the backend checks from `server/`:

```bash
go mod verify
go vet ./...
go test -race ./...                         # unit/handler tests + race detector
./deploy/build.sh                          # static Linux binary (CGO disabled)
```

Test Stripe webhooks locally with the Stripe CLI (a dev tool, not a dependency):

```bash
stripe listen --forward-to localhost:8080/api/webhooks/stripe
# use the printed whsec_... as STRIPE_WEBHOOK_SECRET
```

## Deploy (self-hosted VPS)

1. Run `./deploy/build.sh` from `server/` to build a static `bx-server`
   (verify with `file bx-server`). It targets Linux/amd64 by default; set
   `GOARCH=arm64` when the server uses ARM64.
2. On the target host, create the system service user and data directory:

   ```bash
   sudo useradd --system --user-group --home-dir /opt/bx-server --shell /usr/sbin/nologin bxserver
   sudo install -d -o root -g root -m 755 /opt/bx-server
   sudo install -d -o bxserver -g bxserver -m 700 /opt/bx-server/data
   ```

3. Install the binary at `/opt/bx-server/bx-server` as root with mode `755`.
   Copy `deploy/.env.example` to `/opt/bx-server/.env`, replace the example
   secrets, and set the public frontend origin/URL. Keep it owned by
   `root:bxserver` with mode `640`. Store both the database and uploaded assets
   under `/opt/bx-server/data`, the unit's writable directory.
4. Install `deploy/bx-server.service` in `/etc/systemd/system/`, run
   `sudo systemctl daemon-reload`, then `sudo systemctl enable --now bx-server`.
5. Put Caddy in front using the API handler in `deploy/Caddyfile` for automatic
   HTTPS. That example only proxies `/api/*`; combine it with your static-site
   hosting configuration. Build the frontend with `npm run build:shop` from
   the repository root and serve its `dist/` on the same public origin.

Confirm `/api/health` responds before enabling checkout. Keep `.env`, database
backups, and uploaded assets outside the public static-site directory.

### Automated deploy (Basaltwater)

The repo-root `basaltwater.json` deploys only the static site by default; it does
not build or install this optional backend. To deploy the API, add this service
component to its `components` array:

```json
{
  "name": "shop-api",
  "type": "service",
  "domain": "{{domain}}",
  "path": "/api",
  "build": "server/deploy/build.sh",
  "binary": "server/bx-server",
  "port": "auto",
  "env_file": "{{shared_dir}}/.env",
  "runtime_env": {
    "LISTEN_ADDR": "127.0.0.1:{{port}}",
    "DB_PATH": "{{data_dir}}/bluehexagons.db",
    "SHOP_UPLOAD_DIR": "{{data_dir}}/shop_uploads"
  },
  "health": "/api/health",
  "sqlite_backup": "{{data_dir}}/bluehexagons.db",
  "backup_retention": 14
}
```

Basaltwater generates the hardened systemd unit for the dedicated
`app-<app>-shop-api` user and proxies same-origin `/api` to its assigned
loopback port. It keeps the database and uploaded assets in
`/var/www/.basaltwater_shared/<app>/shop-api/data` across releases, and backs up
the SQLite database before replacement. See [Basaltwater's deployment guide](https://github.com/bluehexagons/basaltwater/blob/main/docs/services/deployments.md)
for the manifest and backup behavior.

Before deploying, put the operator env file at
`/var/www/.basaltwater_shared/<app>/shop-api/.env`, using
`deploy/.env.example` as a starting point. Omit `LISTEN_ADDR`, `DB_PATH`, and
`SHOP_UPLOAD_DIR` because the manifest sets them. The file must be readable but
not writable by the generated service user, and its parent directory must not
be writable by that user. Keep secrets out of the repository.

The non-templated `deploy/bx-server.service` and `deploy/Caddyfile` are for the
manual `/opt/bx-server` deployment only.

### Backups

SQLite runs in WAL mode. The Basaltwater service component above creates a
consistent backup before release replacement. For a manual deployment, back up
the database without stopping the service:

```bash
sqlite3 /opt/bx-server/data/bluehexagons.db ".backup '/backup/bx-$(date +%F).db'"
```
