import { BaseElement } from './BaseElement';
import linkStyles from './Link.css?inline';

export class Link extends BaseElement {
  constructor() {
    super();
    this.injectStyles(linkStyles);
  }

  connectedCallback() {
    const href = this.getAttribute('href');
    if (!href) return;

    const link = document.createElement('a');
    link.href = href;
    
    Array.from(this.attributes).forEach(attr => {
      if (attr.name !== 'href') {
        link.setAttribute(attr.name, attr.value);
      }
    });

    const isExternal = /^(https?:)?\/\//.test(href);
    if (isExternal) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
    
    if (this.hasAttribute('title') && !this.hasAttribute('aria-label')) {
      link.setAttribute('aria-label', this.getAttribute('title') || '');
    }
    
    while (this.firstChild) {
      link.appendChild(this.firstChild);
    }

    this.shadow.appendChild(link);
  }
}

customElements.define('site-link', Link);
