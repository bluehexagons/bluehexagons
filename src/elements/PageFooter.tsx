import { BaseElement } from './BaseElement';
import pageFooterStyles from './PageFooter.css?inline';

export class PageFooter extends BaseElement {
  constructor() {
    super();
    this.injectStyles(pageFooterStyles);
  }

  connectedCallback() {
    const year = new Date().getFullYear();

    this.render(
      <footer class="site-footer">
        <div class="copyright">
          Antistatic © 2018-{year} bluehexagons, all rights reserved. Air Dash Online © 2013 JV5 Games. Logos and
          trademarks attributed to their respective owners. bluehexagons logo, Antistatic logo, background tile
          produced by <site-link href="https://bsky.app/profile/hobith.bsky.social">hobith</site-link>.
        </div>

        <ul class="links-container">
          <li>
            <site-link href="privacy">Privacy</site-link>
          </li>
        </ul>
      </footer>
    );
  }
}

customElements.define('page-footer', PageFooter);