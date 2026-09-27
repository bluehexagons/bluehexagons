import { BaseElement } from './BaseElement';
import contentAreaStyles from './ContentArea.css?inline';
import { sitePath } from '../site-path';

export class ContentArea extends BaseElement {
  constructor() {
    super(contentAreaStyles);
  }

  connectedCallback() {
    this.style.setProperty('--content-background', `url("${sitePath('assets/b6bg_b.png')}")`);
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
