import { BaseElement } from './BaseElement';
import contentAreaStyles from './ContentArea.css?inline';

export class ContentArea extends BaseElement {
  constructor() {
    super(contentAreaStyles);
  }

  connectedCallback() {
    this.render(
      <div class="content_area">
        <div class="content_area__background"></div>
        <div class="content_wrapper">
          <slot name="content"></slot>
        </div>
      </div>
    );
  }
}

customElements.define('content-area', ContentArea);