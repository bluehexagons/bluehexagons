import { BaseElement } from './BaseElement';
import contentAreaStyles from './ContentArea.css?inline';
import { sitePath } from '../site-path';

export class ContentArea extends BaseElement {
  constructor() {
    super(contentAreaStyles);
  }

  connectedCallback() {
    let main: HTMLElement | null = null;
    this.style.setProperty('--content-background', `url("${sitePath('assets/b6bg_b.png')}")`);
    this.render(
      <div class="content_area">
        <a
          class="skip-link"
          href="#main-content"
          onClick={(event: MouseEvent) => {
            event.preventDefault();
            main?.focus();
            main?.scrollIntoView({ block: 'start' });
          }}
        >Skip to main content</a>
        <div class="content_area__background"></div>
        <div class="content_wrapper">
          <slot name="header"></slot>
          <main
            id="main-content"
            class="content_main"
            tabindex="-1"
            ref={(element: Element) => { main = element as HTMLElement; }}
          >
            <slot name="content"></slot>
          </main>
        </div>
      </div>
    );
  }
}

customElements.define('content-area', ContentArea);
