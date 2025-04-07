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

    const links = Array.from(this.children).filter(child => 
      child.nodeName === 'A' || (child.nodeName === 'SLOT' && child.getAttribute('name') === 'links')
    );

    links?.forEach(link => {
      nav.appendChild(link.cloneNode(true));
    });

    const slot = document.createElement('slot');
    slot.name = 'additional';
    
    header.appendChild(nav);
    header.appendChild(slot);
    this.shadow.appendChild(header);
  }
}

customElements.define('page-header', PageHeader);