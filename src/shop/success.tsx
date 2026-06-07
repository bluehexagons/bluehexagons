import '../bootstrap';
import './shop.css';
import { render } from '../render';

const app = document.getElementById('app');
if (!app) throw new Error('Missing #app container');

const rawOrder = new URLSearchParams(window.location.search).get('order') ?? '';
const order = /^\d{1,18}$/.test(rawOrder) ? rawOrder : '';

render(
  <>
    <content-area>
      <page-header slot="content"></page-header>
      <article slot="content" class="shop__page">
        <div class="shop__hero">
          <div class="shop__eyebrow">Stripe checkout return</div>
          <h1>Thank you!</h1>
          <p class="shop__lede">
            If your payment completed{order ? ` for order #${order}` : ''}, it will be confirmed by email after Stripe
            notifies the shop.
          </p>
        </div>
        <p>
          <site-link href="/shop/">Return to the shop</site-link>
        </p>
      </article>
    </content-area>
    <page-footer></page-footer>
  </>,
  app
);
