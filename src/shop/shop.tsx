import '../bootstrap';
import './shop.css';
import { render } from '../render';
import { api, apiURL, ApiError, type Product, type User } from './api';

// A small, dependency-free shop UI: it loads the catalog and current user,
// keeps a client-side cart, and hands off to Stripe's hosted Checkout. There is
// no framework — state changes simply rebuild the tree and replace #app.

const app = document.getElementById('app');
if (!app) throw new Error('Missing #app container');

const MAX_CART_QUANTITY = 100;
const STRIPE_CHECKOUT_HOST = 'checkout.stripe.com';

interface State {
  loading: boolean;
  user: User | null;
  products: Product[];
  cart: Map<number, number>; // productId -> quantity
  authError: string;
  cartError: string;
  authBusy: boolean;
  checkoutBusy: boolean;
}

const state: State = {
  loading: true,
  user: null,
  products: [],
  cart: new Map(),
  authError: '',
  cartError: '',
  authBusy: false,
  checkoutBusy: false,
};

let authEmail = '';
let authPassword = '';

const money = (cents: number, currency: string) => {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: currency.toUpperCase() }).format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(2)} ${currency.toUpperCase()}`;
  }
};

const errMessage = (err: unknown): string => (err instanceof Error ? err.message : 'Something went wrong');
const cartItemCount = (): number => [...state.cart.values()].reduce((sum, quantity) => sum + quantity, 0);

function setState(patch: Partial<State>): void {
  Object.assign(state, patch);
  renderAll();
}

async function init(): Promise<void> {
  try {
    state.user = await api.me();
  } catch (err) {
    if (!(err instanceof ApiError && err.status === 401)) state.cartError = errMessage(err);
  }
  try {
    state.products = await api.products();
  } catch (err) {
    state.cartError = errMessage(err);
  }
  setState({ loading: false });
}

async function submitAuth(kind: 'login' | 'register'): Promise<void> {
  if (state.authBusy) return;

  const email = authEmail.trim();
  const password = authPassword;
  if (!email || !password) {
    setState({ authError: 'Enter an email and password.' });
    return;
  }
  if (kind === 'register' && password.length < 8) {
    setState({ authError: 'Password must be at least 8 characters.' });
    return;
  }

  setState({ authBusy: true, authError: '' });
  try {
    const user = kind === 'login' ? await api.login(email, password) : await api.register(email, password);
    authPassword = '';
    setState({ user, authBusy: false, authError: '' });
  } catch (err) {
    setState({ authBusy: false, authError: errMessage(err) });
  }
}

async function logout(): Promise<void> {
  if (state.authBusy) return;
  setState({ authBusy: true });
  try {
    await api.logout();
  } catch {
    /* ignore: clearing local state is enough */
  }
  authPassword = '';
  setState({ user: null, cart: new Map(), authBusy: false });
}

function addToCart(id: number): void {
  if (!state.products.some((p) => p.id === id)) return;
  const current = state.cart.get(id) ?? 0;
  if (current >= MAX_CART_QUANTITY) {
    setState({ cartError: `You can add up to ${MAX_CART_QUANTITY} of one item.` });
    return;
  }
  const cart = new Map(state.cart);
  cart.set(id, current + 1);
  setState({ cart, cartError: '' });
}

function removeFromCart(id: number): void {
  const cart = new Map(state.cart);
  const next = (cart.get(id) ?? 0) - 1;
  if (next <= 0) cart.delete(id);
  else cart.set(id, next);
  setState({ cart, cartError: '' });
}

function removeProductFromCart(id: number): void {
  const cart = new Map(state.cart);
  cart.delete(id);
  setState({ cart, cartError: '' });
}

function checkoutDestination(raw: string): string {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error('Checkout returned an invalid redirect.');
  }
  if (url.protocol !== 'https:' || url.hostname !== STRIPE_CHECKOUT_HOST) {
    throw new Error('Checkout returned an unexpected destination.');
  }
  return url.toString();
}

async function checkout(): Promise<void> {
  if (state.checkoutBusy) return;
  if (!state.user) {
    setState({ cartError: 'Please sign in to check out.' });
    return;
  }
  const items = [...state.cart.entries()].map(([product_id, quantity]) => ({ product_id, quantity }));
  if (items.length === 0) {
    setState({ cartError: 'Your cart is empty.' });
    return;
  }
  const byId = new Map(state.products.map((p) => [p.id, p] as const));
  if (items.some((item) => !byId.has(item.product_id))) {
    setState({ cartError: 'One cart item is no longer available. Refresh and try again.' });
    return;
  }
  const currencies = new Set(items.map((item) => byId.get(item.product_id)?.currency));
  if (currencies.size > 1) {
    setState({ cartError: 'Cart items must use one currency.' });
    return;
  }

  setState({ checkoutBusy: true, cartError: '' });
  try {
    const { checkout_url } = await api.checkout(items);
    window.location.assign(checkoutDestination(checkout_url));
  } catch (err) {
    setState({ checkoutBusy: false, cartError: errMessage(err) });
  }
}

function authPanel(): Node {
  if (state.user) {
    return (
      <div class="shop__auth">
        <div>
          Signed in as <strong>{state.user.email}</strong>
          {state.user.is_admin ? (
            <div class="shop__muted">
              Need to manage listings? <site-link href="/shop/admin.html">Open shop admin</site-link>
            </div>
          ) : null}
        </div>
        <button class="shop__button shop__button--ghost" onClick={() => void logout()} disabled={state.authBusy}>
          {state.authBusy ? 'Signing out...' : 'Log out'}
        </button>
      </div>
    );
  }
  return (
    <div class="shop__auth">
      <div>
        <strong>Account required</strong>
        <div class="shop__muted">Sign in or create an account before checkout. Your cart stays here while you do.</div>
      </div>
      <form
        class="shop__form"
        onSubmit={(event: Event) => {
          event.preventDefault();
          void submitAuth('login');
        }}
      >
        <label>
          <span>Email</span>
          <input
            type="email"
            autocomplete="email"
            inputmode="email"
            placeholder="you@example.com"
            value={authEmail}
            disabled={state.authBusy}
            onInput={(event: Event) => {
              authEmail = (event.currentTarget as HTMLInputElement).value;
            }}
          />
        </label>
        <label>
          <span>Password</span>
          <input
            type="password"
            autocomplete="current-password"
            placeholder="8+ characters"
            value={authPassword}
            disabled={state.authBusy}
            onInput={(event: Event) => {
              authPassword = (event.currentTarget as HTMLInputElement).value;
            }}
          />
        </label>
        <div class="shop__form-actions">
          <button class="shop__button" type="submit" disabled={state.authBusy}>
            {state.authBusy ? 'Working...' : 'Log in'}
          </button>
          <button
            class="shop__button shop__button--ghost"
            type="button"
            onClick={() => void submitAuth('register')}
            disabled={state.authBusy}
          >
            Create account
          </button>
        </div>
      </form>
      <div class="shop__error" role={state.authError ? 'alert' : undefined} aria-live="polite">
        {state.authError}
      </div>
    </div>
  );
}

function productCard(p: Product): Node {
  const quantity = state.cart.get(p.id) ?? 0;
  const preview = p.previews.find((asset) => asset.content_type.startsWith('image/'));
  const title = p.title || p.name;
  const delivery = p.kind === 'physical' ? 'Physical item' : 'Digital delivery';
  const descriptionFallback = p.kind === 'physical' ? 'Fulfillment details are provided after checkout.' : 'Digital delivery after checkout.';
  return (
    <article class="shop__product">
      {preview ? <img class="shop__product-preview" src={apiURL(preview.url)} alt={`${title} preview`} loading="lazy" decoding="async" /> : null}
      <div class="shop__product-head">
        <strong>{title}</strong>
        <span>{p.sku}</span>
      </div>
      <div class="shop__product-kind">{delivery}</div>
      <div class="shop__muted">{p.description || descriptionFallback}</div>
      <div class="shop__price">{money(p.price_cents, p.currency)}</div>
      <button class="shop__button" onClick={() => addToCart(p.id)} disabled={quantity >= MAX_CART_QUANTITY}>
        {quantity > 0 ? `Add another (${quantity} in cart)` : 'Add to cart'}
      </button>
    </article>
  );
}

function cartView(): Node {
  const entries = [...state.cart.entries()];
  const byId = new Map(state.products.map((p) => [p.id, p] as const));
  const lines = entries.flatMap(([id, quantity]) => {
    const product = byId.get(id);
    return product ? [{ product, quantity }] : [];
  });
  const hasUnavailableItems = lines.length !== entries.length;
  const currencies = new Set(lines.map(({ product }) => product.currency));
  const hasMixedCurrencies = currencies.size > 1;
  const currency = lines[0]?.product.currency ?? 'usd';
  const total = lines.reduce((sum, { product, quantity }) => sum + product.price_cents * quantity, 0);
  const itemCount = lines.reduce((sum, { quantity }) => sum + quantity, 0);
  const checkoutDisabled =
    entries.length === 0 || state.checkoutBusy || hasUnavailableItems || hasMixedCurrencies || state.products.length === 0;
  const checkoutLabel = state.checkoutBusy
    ? 'Opening Stripe...'
    : entries.length === 0
      ? 'Add an item to checkout'
      : !state.user
        ? 'Sign in to checkout'
        : 'Checkout securely';

  return (
    <aside class="shop__cart" aria-labelledby="shop-cart-heading">
      <div class="shop__cart-head">
        <h2 id="shop-cart-heading">Cart</h2>
        {itemCount > 0 ? (
          <span class="shop__cart-count" aria-live="polite">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
        ) : null}
      </div>
      {entries.length === 0 ? (
        <div class="shop__empty shop__empty--cart">Choose something from the catalog and your checkout summary will appear here.</div>
      ) : (
        <ul class="shop__cart-list">
          {lines.map(({ product, quantity }) => {
            const title = product.title || product.name;
            return (
              <li class="shop__cart-row">
                <div class="shop__cart-item">
                  <strong>{title}</strong>
                  <span class="shop__muted">{money(product.price_cents, product.currency)} each</span>
                </div>
                <div class="shop__cart-controls" aria-label={`${title} quantity controls`}>
                  <button
                    class="shop__icon-button"
                    onClick={() => removeFromCart(product.id)}
                    aria-label={`Remove one ${title}`}
                  >
                    -
                  </button>
                  <span class="shop__cart-quantity" aria-label={`${quantity} in cart`}>
                    {quantity}
                  </span>
                  <button
                    class="shop__icon-button"
                    onClick={() => addToCart(product.id)}
                    disabled={quantity >= MAX_CART_QUANTITY}
                    aria-label={`Add one ${title}`}
                  >
                    +
                  </button>
                  <button class="shop__button shop__button--ghost shop__button--compact" onClick={() => removeProductFromCart(product.id)}>
                    Remove
                  </button>
                </div>
                <span class="shop__cart-price">{money(product.price_cents * quantity, product.currency)}</span>
              </li>
            );
          })}
        </ul>
      )}
      <div class="shop__total">
        <span>Total</span>
        <strong>{hasMixedCurrencies ? 'Multiple currencies' : money(total, currency)}</strong>
      </div>
      {hasUnavailableItems ? <div class="shop__error">One cart item is no longer available.</div> : null}
      {hasMixedCurrencies ? <div class="shop__error">Cart items must use one currency.</div> : null}
      <div class="shop__error" role={state.cartError ? 'alert' : undefined} aria-live="polite">
        {state.cartError}
      </div>
      <button class="shop__button shop__checkout" onClick={() => void checkout()} disabled={checkoutDisabled}>
        {checkoutLabel}
      </button>
      <p class="shop__security-note">Payments are handled on Stripe-hosted checkout. Card details never touch this site.</p>
    </aside>
  );
}

function buildTree(): Node {
  return (
    <>
      <content-area>
        <page-header slot="content"></page-header>
        <article slot="content" class="shop__page">
          <div class="shop__hero">
            <div class="shop__eyebrow">Optional shop module</div>
            <h1>Shop</h1>
            <p class="shop__lede">Pick up bluehexagons digital goods through a small audited cart and Stripe Checkout.</p>
          </div>
          {state.loading ? (
            <div class="shop__empty">Loading catalog...</div>
          ) : (
            <div class="shop">
              {authPanel()}
              <section class="shop__catalog" aria-labelledby="shop-catalog-heading">
                <div class="shop__section-head">
                  <h2 id="shop-catalog-heading">Catalog</h2>
                  <span>
                    {state.products.length} {state.products.length === 1 ? 'listing' : 'listings'} · {cartItemCount()} in cart
                  </span>
                </div>
                {state.products.length === 0 ? (
                  <div class="shop__empty">No products are available right now. Check back after the next shop update.</div>
                ) : (
                  <div class="shop__products">{state.products.map(productCard)}</div>
                )}
              </section>
              {cartView()}
            </div>
          )}
        </article>
      </content-area>
      <page-footer></page-footer>
    </>
  );
}

function renderAll(): void {
  render(buildTree(), app!);
}

renderAll();
void init();
