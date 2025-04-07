import { BaseElement } from './BaseElement';
import pageFooterStyles from './PageFooter.css?inline';

export class PageFooter extends BaseElement {
  constructor() {
    super();
    this.injectStyles(pageFooterStyles);
  }

  connectedCallback() {
    const footer = document.createElement('footer');
    footer.className = 'site-footer';

    const linksContainer = document.createElement('ul');
    linksContainer.className = 'links-container';
    
    const linksSlot = document.createElement('slot');
    linksSlot.name = 'links';
    linksContainer.appendChild(linksSlot);

    const copyright = document.createElement('span');
    copyright.className = 'copyright';
    
    const copyrightSlot = document.createElement('slot');
    copyrightSlot.name = 'copyright';
    copyright.appendChild(copyrightSlot);

    footer.appendChild(copyright);
    footer.appendChild(linksContainer);
    this.shadow.appendChild(footer);
  }
}

customElements.define('page-footer', PageFooter);