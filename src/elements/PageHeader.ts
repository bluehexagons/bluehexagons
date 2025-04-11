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

    // Define links directly
    nav.innerHTML = `
      <a href="/"><span>bluehexagons</span></a>
      <a href="/antistatic"><span>Antistatic</span></a>
      <a href="https://foodguide.bluehexagons.com"><span>DS Food Guide</span></a>
    `;

    // Keep the slot for potential additional content
    const slot = document.createElement('slot');
    slot.name = 'additional';

    header.appendChild(nav);
    header.appendChild(slot);
    this.shadow.appendChild(header);
  }
}

customElements.define('page-header', PageHeader);