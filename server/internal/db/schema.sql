-- Schema for the bluehexagons shop/account backend.
-- Applied on startup; all statements are idempotent (IF NOT EXISTS) so this
-- doubles as a lightweight migration for additive changes.
-- All timestamps are unix seconds (INTEGER).

CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY,
    email         TEXT    NOT NULL UNIQUE,
    password_hash TEXT    NOT NULL,
    created_at    INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
    token      TEXT    PRIMARY KEY,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at INTEGER NOT NULL,
    expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS products (
    id          INTEGER PRIMARY KEY,
    sku         TEXT    NOT NULL UNIQUE,
    name        TEXT    NOT NULL,
    description TEXT    NOT NULL DEFAULT '',
    price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
    currency    TEXT    NOT NULL DEFAULT 'usd',
    active      INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS product_details (
    product_id          INTEGER PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
    kind                TEXT    NOT NULL DEFAULT 'digital'
                              CHECK (kind IN ('digital','physical')),
    post_purchase_text  TEXT    NOT NULL DEFAULT '',
    created_at          INTEGER NOT NULL,
    updated_at          INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS product_assets (
    id           INTEGER PRIMARY KEY,
    product_id   INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    role         TEXT    NOT NULL CHECK (role IN ('preview','download')),
    filename     TEXT    NOT NULL,
    content_type TEXT    NOT NULL,
    size_bytes   INTEGER NOT NULL CHECK (size_bytes >= 0),
    storage_name TEXT    NOT NULL UNIQUE,
    sort_order   INTEGER NOT NULL DEFAULT 0,
    created_at   INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_product_assets_product ON product_assets(product_id, role, sort_order, id);

CREATE TABLE IF NOT EXISTS product_keys (
    id                    INTEGER PRIMARY KEY,
    product_id            INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    key_text              TEXT    NOT NULL,
    claimed_order_item_id INTEGER REFERENCES order_items(id),
    claimed_user_id       INTEGER REFERENCES users(id),
    claimed_at            INTEGER,
    created_at            INTEGER NOT NULL,
    UNIQUE(product_id, key_text),
    CHECK (
        (claimed_order_item_id IS NULL AND claimed_user_id IS NULL AND claimed_at IS NULL) OR
        (claimed_order_item_id IS NOT NULL AND claimed_user_id IS NOT NULL AND claimed_at IS NOT NULL)
    )
);
CREATE INDEX IF NOT EXISTS idx_product_keys_product_claimed ON product_keys(product_id, claimed_at);
CREATE INDEX IF NOT EXISTS idx_product_keys_order_item ON product_keys(claimed_order_item_id);

CREATE TABLE IF NOT EXISTS orders (
    id                INTEGER PRIMARY KEY,
    user_id           INTEGER NOT NULL REFERENCES users(id),
    status            TEXT    NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending','paid','fulfilled','refunded','cancelled')),
    total_cents       INTEGER NOT NULL CHECK (total_cents >= 0),
    currency          TEXT    NOT NULL DEFAULT 'usd',
    stripe_session_id TEXT    UNIQUE,
    created_at        INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);

CREATE TABLE IF NOT EXISTS order_items (
    id               INTEGER PRIMARY KEY,
    order_id         INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id       INTEGER NOT NULL REFERENCES products(id),
    quantity         INTEGER NOT NULL CHECK (quantity > 0),
    unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents >= 0)
);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- Records processed Stripe webhook event ids so delivery retries are idempotent.
CREATE TABLE IF NOT EXISTS processed_events (
    event_id     TEXT    PRIMARY KEY,
    processed_at INTEGER NOT NULL
);
