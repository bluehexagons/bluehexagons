import { BaseElement } from './BaseElement';
import pageHeaderStyles from './PageHeader.css?inline';

export class PageHeader extends BaseElement {
  constructor() {
    super(pageHeaderStyles);
  }

  connectedCallback() {
    const pathname = window.location.pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '') || '/';
    const currentPath = pathname === '/' ? pathname : pathname.replace(/\/+$/, '');

    this.render(
      <nav class="navbar" aria-label="Primary navigation">
        <span class="nav">
          <a href="/" aria-current={currentPath === '/' ? 'page' : undefined}>bluehexagons</a>
          <a href="/antistatic" aria-current={currentPath === '/antistatic' ? 'page' : undefined}>Antistatic</a>
          <a href="https://store.steampowered.com/app/3884650/End_of_Blackjack">End of Blackjack</a>
          <a href="https://clicker.bluehexagons.com">Clicker</a>
          <a href="https://foodguide.bluehexagons.com">DS Food Guide</a>
        </span>
      </nav>
    );
  }
}

customElements.define('page-header', PageHeader);
