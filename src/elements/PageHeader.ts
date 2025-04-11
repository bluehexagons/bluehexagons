import { BaseElement } from './BaseElement';
import pageHeaderStyles from './PageHeader.css?inline';

export class PageHeader extends BaseElement {
  constructor() {
    super();
    this.injectStyles(pageHeaderStyles);
  }

  connectedCallback() {
    const header = document.createElement('nav');
    header.className = 'navbar';

    const nav = document.createElement('span');
    nav.className = 'nav';
    nav.innerHTML = `
      <a href="/">bluehexagons</a>
      <a href="/antistatic">Antistatic</a>
      <a href="https://foodguide.bluehexagons.com">DS Food Guide</a>
    `;

    header.appendChild(nav);
    this.shadow.appendChild(header);
  }
}

customElements.define('page-header', PageHeader);