import { BaseElement } from './BaseElement';
import pageFooterStyles from './PageFooter.css?inline';
import { sitePath } from '../site-path';
import { artworkCredit, copyrightNotice } from '../content/footer';

export class PageFooter extends BaseElement {
  constructor() {
    super(pageFooterStyles);
  }

  connectedCallback() {
    const year = new Date().getFullYear();

    this.render(
      <footer class="site-footer">
        <div class="copyright">
          {copyrightNotice(year)}{' '}
          <site-link href={artworkCredit.href}>{artworkCredit.name}</site-link>.
        </div>

        <ul class="links-container">
          <li>
            <site-link href={sitePath('profile.html')}>Profile / resume</site-link>
          </li>
          <li>
            <site-link href={sitePath('profile.md')}>Concise profile</site-link>
          </li>
          <li>
            <site-link href={sitePath('privacy.html')}>Privacy</site-link>
          </li>
        </ul>
      </footer>
    );
  }
}

customElements.define('page-footer', PageFooter);
