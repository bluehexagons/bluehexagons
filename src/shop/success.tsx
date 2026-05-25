import '../bootstrap';
import { render } from '../render';

const app = document.getElementById('app');
if (!app) throw new Error('Missing #app container');

const order = new URLSearchParams(window.location.search).get('order');

render(
  <>
    <content-area>
      <page-header slot="content"></page-header>
      <article slot="content">
        <h1>Thank you!</h1>
        <p>Your payment was received{order ? ` for order #${order}` : ''}. A confirmation will follow by email.</p>
        <p>
          <site-link href="/shop/">Return to the shop</site-link>
        </p>
      </article>
    </content-area>
    <page-footer></page-footer>
  </>,
  app
);
