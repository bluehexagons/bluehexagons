import { BaseElement } from './BaseElement';
import pageHeaderStyles from './PageHeader.css?inline';
import { sitePath } from '../site-path';

export class PageHeader extends BaseElement {
  constructor() {
    super(pageHeaderStyles);
  }

  connectedCallback() {
    const currentPath = window.location.pathname.replace(/index\.html$/, '');

    this.render(
      <nav class="navbar" aria-label="Primary navigation">
        <span class="nav">
          <a href={sitePath('')} aria-current={currentPath === sitePath('') ? 'page' : undefined}>bluehexagons</a>
          <a href={sitePath('#basaltwater')}>Basaltwater</a>
          <a href={sitePath('antistatic.html')} aria-current={currentPath === sitePath('antistatic.html') ? 'page' : undefined}>Antistatic</a>
          <a href="https://store.steampowered.com/app/3884650/End_of_Blackjack">End of Blackjack</a>
          <a href="https://clicker.bluehexagons.com">Clicker</a>
          <a href="https://foodguide.bluehexagons.com">DS Food Guide</a>
        </span>
      </nav>
    );
  }
}

customElements.define('page-header', PageHeader);
