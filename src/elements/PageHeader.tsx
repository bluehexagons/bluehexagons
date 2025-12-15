import { BaseElement } from './BaseElement';
import pageHeaderStyles from './PageHeader.css?inline';

export class PageHeader extends BaseElement {
  constructor() {
    super();
    this.injectStyles(pageHeaderStyles);
  }

  connectedCallback() {
    this.render(
      <nav class="navbar">
        <span class="nav">
          <a href="/">bluehexagons</a>
          <a href="/antistatic">Antistatic</a>
          <a href="https://store.steampowered.com/app/3884650/End_of_Blackjack">End of Blackjack</a>
          <a href="https://clicker.bluehexagons.com">Clicker</a>
          <a href="https://foodguide.bluehexagons.com">DS Food Guide</a>
        </span>
      </nav>
    );
  }
}

customElements.define('page-header', PageHeader);