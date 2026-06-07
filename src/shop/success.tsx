import '../bootstrap';
import './shop.css';
import { render } from '../render';
import { api, apiURL, ApiError, type OrderDeliverables, type PurchasedItem } from './api';

const app = document.getElementById('app');
if (!app) throw new Error('Missing #app container');

const rawOrder = new URLSearchParams(window.location.search).get('order') ?? '';
const order = /^\d{1,18}$/.test(rawOrder) ? rawOrder : '';
const orderID = order ? Number(order) : 0;

interface State {
  loading: boolean;
  delivery: OrderDeliverables | null;
  error: string;
  claiming: number | null;
}

const state: State = {
  loading: Boolean(orderID),
  delivery: null,
  error: '',
  claiming: null,
};

const errMessage = (err: unknown): string => {
  if (err instanceof ApiError && err.status === 401) return 'Sign in on the shop page to view this order.';
  return err instanceof Error ? err.message : 'Something went wrong';
};

function setState(patch: Partial<State>): void {
  Object.assign(state, patch);
  renderAll();
}

async function loadDelivery(): Promise<void> {
  if (!orderID) {
    setState({ loading: false });
    return;
  }
  try {
    const delivery = await api.orderDeliverables(orderID);
    setState({ delivery, loading: false, error: '' });
  } catch (err) {
    setState({ loading: false, error: errMessage(err) });
  }
}

async function claimKey(orderItemID: number): Promise<void> {
  if (state.claiming) return;
  setState({ claiming: orderItemID, error: '' });
  try {
    await api.claimKey(orderItemID);
    const delivery = orderID ? await api.orderDeliverables(orderID) : null;
    setState({ delivery, claiming: null, error: '' });
  } catch (err) {
    setState({ claiming: null, error: errMessage(err) });
  }
}

function fileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
}

function keyPanel(item: PurchasedItem): Node {
  if (item.keys.total === 0) return <></>;
  const canClaim = item.keys.claimable > 0 && item.keys.remaining > 0;
  return (
    <div class="shop__delivery-block">
      <h3>Keys</h3>
      {item.keys.claimed.length === 0 ? <div class="shop__muted">No key claimed yet.</div> : null}
      {item.keys.claimed.length > 0 ? (
        <ul class="shop__key-list">
          {item.keys.claimed.map((key) => (
            <li>
              <code class="shop__key-code">{key.key_text}</code>
              <span class="shop__muted">claimed</span>
            </li>
          ))}
        </ul>
      ) : null}
      {canClaim ? (
        <button class="shop__button" onClick={() => void claimKey(item.order_item_id)} disabled={state.claiming === item.order_item_id}>
          {state.claiming === item.order_item_id ? 'Claiming...' : 'Claim a key'}
        </button>
      ) : item.keys.claimable > 0 ? (
        <div class="shop__error">Keys are temporarily out of stock. Contact support with your order number.</div>
      ) : null}
    </div>
  );
}

function deliveryItem(item: PurchasedItem): Node {
  return (
    <article class="shop__delivery-item">
      <div>
        <h2>{item.title}</h2>
        {item.quantity > 1 ? <div class="shop__product-kind">Quantity {item.quantity}</div> : null}
      </div>
      {item.post_purchase_text ? <div class="shop__post-purchase">{item.post_purchase_text}</div> : null}
      {item.downloads.length > 0 ? (
        <div class="shop__delivery-block">
          <h3>Downloads</h3>
          <ul class="shop__download-list">
            {item.downloads.map((asset) => (
              <li>
                <a class="shop__download" href={apiURL(asset.url)}>
                  {asset.filename}
                </a>
                <span class="shop__muted">{fileSize(asset.size_bytes)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {keyPanel(item)}
    </article>
  );
}

function deliveryView(): Node {
  if (!orderID) return <div class="shop__empty">No order was provided in the checkout return URL.</div>;
  if (state.loading) return <div class="shop__empty">Loading your digital delivery...</div>;
  if (state.error) {
    return (
      <div class="shop__empty">
        <div class="shop__error" role="alert">
          {state.error}
        </div>
      </div>
    );
  }
  if (!state.delivery) return <div class="shop__empty">Order details are unavailable.</div>;
  if (state.delivery.status !== 'paid' && state.delivery.status !== 'fulfilled') {
    return (
      <div class="shop__empty">
        Stripe has returned you to the shop, but this order is still <strong>{state.delivery.status}</strong>. Digital items unlock
        after the payment webhook arrives.
      </div>
    );
  }
  return <section class="shop__delivery">{state.delivery.items.map(deliveryItem)}</section>;
}

function buildTree(): Node {
  return (
    <>
      <content-area>
        <page-header slot="content"></page-header>
        <article slot="content" class="shop__page">
          <div class="shop__hero">
            <div class="shop__eyebrow">Stripe checkout return</div>
            <h1>Thank you!</h1>
            <p class="shop__lede">
              If your payment completed{order ? ` for order #${order}` : ''}, your digital items will appear here once Stripe
              confirms the checkout.
            </p>
          </div>
          {deliveryView()}
          <p>
            <site-link href="/shop/">Return to the shop</site-link>
          </p>
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
void loadDelivery();
