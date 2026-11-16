# Optional shop/account API

The unfinished shop’s Go API builds as one static binary, independently of the
static site. Requires Go 1.27.3+; see [`go.mod`](go.mod).

It uses the standard library for HTTP, JSON, sessions, and Stripe REST/webhook
handling. Its two direct module dependencies are `modernc.org/sqlite` (pure-Go
SQLite) and `golang.org/x/crypto` (Argon2id). Stripe handles card data.

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
deploy/                 static build script and managed-service .env.example
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
defaults to `loren@bluehexagons.com`; existing users with that exact stored email
receive admin rights at startup. `SHOP_ADMIN_EMAILS` adds comma-separated admins.
New configured admin accounts must register through `/shop/admin.html` with
`SHOP_ADMIN_SIGNUP_TOKEN`; remove or rotate that token after bootstrap.

Assets are stored in `SHOP_UPLOAD_DIR`. Previews are public; downloads require a
paid/fulfilled order containing the product. Admins may also add external assets:
production URLs must use HTTPS and resolve to public IPs.
`SHOP_ALLOW_UNSAFE_ASSET_URLS=true` is for local/private testing only. Authorized
linked downloads redirect to the third party; linked previews are fetched once
and converted to local JPEG thumbnails.

Physical products remain inactive drafts until shipping is supported. Prices
use Stripe’s currency minor units, despite the legacy `price_cents` field name.
Key-backed products reserve stock for pending and paid orders; expiration or
failure releases pending stock.

Configure Stripe webhooks for `checkout.session.completed`,
`checkout.session.async_payment_succeeded`,
`checkout.session.async_payment_failed`, and `checkout.session.expired`.

## Local development

From `server/`:

```bash
SEED_DEMO=1 COOKIE_SECURE=false go run .     # http://127.0.0.1:8080
```

Configuration comes from process environment variables; `.env` files are not
loaded automatically. `SEED_DEMO=1` adds example products; `COOKIE_SECURE=false`
allows cookies on local HTTP.

In another terminal, run `npm ci && npm run dev:shop` from the repository root
and open `http://localhost:3000/shop/`. This is the default allowed frontend
origin. If its host or port changes, update `FRONTEND_ORIGIN`, which also controls
Stripe return URLs.

For a local admin, add
`SHOP_PRIMARY_ADMIN_EMAIL=you@example.com SHOP_ADMIN_SIGNUP_TOKEN=dev-token`
to the API command, then register at `/shop/admin.html` with that email and token.
Local state lives in `server/bluehexagons.db` and `server/shop_uploads/`, both
ignored by Git.

Run checks from `server/`:

```bash
go mod verify
go vet ./...
go test -race ./...
./deploy/build.sh                          # static Linux binary, CGO disabled
```

To test webhooks with the Stripe CLI:

```bash
stripe listen --forward-to localhost:8080/api/webhooks/stripe
# Set STRIPE_WEBHOOK_SECRET to the printed whsec_... value.
```

## Deployment and recovery

The default site deployment excludes the shop. Use the
[opt-in manifest and private configuration procedure](../docs/basaltwater.md#optional-shop-deployment)
when development resumes. Basaltwater manages service accounts, systemd units,
loopback ports, persistent state, and proxy routing. `/api/health` checks the
database connection.

Follow the [backup and restore procedure](../docs/basaltwater.md#shop-backup-and-restore)
for both SQLite and uploads; database backups alone cannot recover the shop.
