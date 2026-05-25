import '../bootstrap';
import './shop.css';
import { render } from '../render';
import { api, ApiError, type Product, type User } from './api';

// A small, dependency-free shop UI: it loads the catalog and current user,
// keeps a client-side cart, and hands off to Stripe's hosted Checkout. There is
// no framework — state changes simply rebuild the tree and replace #app.

const app = document.getElementById('app');
if (!app) throw new Error('Missing #app container');

interface State {
  loading: boolean;
  user: User | null;
  products: Product[];
  cart: Map<number, number>; // productId -> quantity
  authError: string;
  cartError: string;
}

const state: State = {
  loading: true,
  user: null,
  products: [],
  cart: new Map(),
  authError: '',
  cartError: '',
};

let emailInput: HTMLInputElement | null = null;
let passwordInput: HTMLInputElement | null = null;

const money = (cents: number, currency: string) =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency: currency.toUpperCase() }).format(cents / 100);

const errMessage = (err: unknown): string => (err instanceof Error ? err.message : 'Something went wrong');

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
  const email = emailInput?.value.trim() ?? '';
  const password = passwordInput?.value ?? '';
  try {
    const user = kind === 'login' ? await api.login(email, password) : await api.register(email, password);
    setState({ user, authError: '' });
  } catch (err) {
    setState({ authError: errMessage(err) });
  }
}

async function logout(): Promise<void> {
  try {
    await api.logout();
  } catch {
    /* ignore: clearing local state is enough */
  }
  setState({ user: null, cart: new Map() });
}

function addToCart(id: number): void {
  state.cart.set(id, (state.cart.get(id) ?? 0) + 1);
  setState({ cartError: '' });
}

function removeFromCart(id: number): void {
  const next = (state.cart.get(id) ?? 0) - 1;
  if (next <= 0) state.cart.delete(id);
  else state.cart.set(id, next);
  setState({});
}

async function checkout(): Promise<void> {
  if (!state.user) {
    setState({ cartError: 'Please sign in to check out.' });
    return;
  }
  const items = [...state.cart.entries()].map(([product_id, quantity]) => ({ product_id, quantity }));
  if (items.length === 0) {
    setState({ cartError: 'Your cart is empty.' });
    return;
  }
  try {
    const { checkout_url } = await api.checkout(items);
    window.location.href = checkout_url; // redirect to Stripe's hosted page
  } catch (err) {
    setState({ cartError: errMessage(err) });
  }
}

function authPanel(): Node {
  if (state.user) {
    return (
      <div class="shop__auth">
        Signed in as <strong>{state.user.email}</strong>{' '}
        <button onClick={() => void logout()}>Log out</button>
      </div>
    );
  }
  return (
    <div class="shop__auth">
      <div>Sign in or create an account to purchase.</div>
      <div class="shop__form">
        <input type="email" placeholder="Email" ref={(el: Element) => (emailInput = el as HTMLInputElement)} />
        <input type="password" placeholder="Password" ref={(el: Element) => (passwordInput = el as HTMLInputElement)} />
        <button onClick={() => void submitAuth('login')}>Log in</button>
        <button onClick={() => void submitAuth('register')}>Register</button>
      </div>
      <div class="shop__error">{state.authError}</div>
    </div>
  );
}

function productCard(p: Product): Node {
  return (
    <div class="shop__product">
      <div>
        <strong>{p.name}</strong>
      </div>
      <div class="shop__muted">{p.description}</div>
      <div class="shop__price">{money(p.price_cents, p.currency)}</div>
      <button onClick={() => addToCart(p.id)}>Add to cart</button>
    </div>
  );
}

function cartView(): Node {
  const entries = [...state.cart.entries()];
  const byId = new Map(state.products.map((p) => [p.id, p] as const));
  const currency = state.products[0]?.currency ?? 'usd';
  const total = entries.reduce((sum, [id, qty]) => sum + (byId.get(id)?.price_cents ?? 0) * qty, 0);

  return (
    <div class="shop__cart">
      <h2>Cart</h2>
      {entries.length === 0 ? (
        <div class="shop__muted">Your cart is empty.</div>
      ) : (
        <ul>
          {entries.map(([id, qty]) => {
            const p = byId.get(id);
            return (
              <li>
                <span>
                  {p?.name ?? `#${id}`} × {qty}
                </span>
                <span>
                  {money((p?.price_cents ?? 0) * qty, p?.currency ?? currency)}{' '}
                  <button onClick={() => removeFromCart(id)} aria-label="Remove one">
                    −
                  </button>
                </span>
              </li>
            );
          })}
        </ul>
      )}
      <div>
        <strong>Total: {money(total, currency)}</strong>
      </div>
      <div class="shop__error">{state.cartError}</div>
      <button onClick={() => void checkout()} disabled={entries.length === 0}>
        Checkout
      </button>
    </div>
  );
}

function buildTree(): Node {
  return (
    <>
      <content-area>
        <page-header slot="content"></page-header>
        <article slot="content">
          <h1>Shop</h1>
          {state.loading ? (
            <div class="shop__muted">Loading…</div>
          ) : (
            <div class="shop">
              {authPanel()}
              <div class="shop__products">{state.products.map(productCard)}</div>
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
