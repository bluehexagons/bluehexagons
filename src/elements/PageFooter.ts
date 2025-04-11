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
    linksContainer.innerHTML = `<li><a href="antistatic/privacy">Privacy</a></li>`;

    const copyright = document.createElement('div');
    copyright.className = 'copyright';
    copyright.innerHTML = `
      Antistatic &copy; 2018-${new Date().getFullYear()} bluehexagons, all rights reserved.
      Air Dash Online &copy; 2013 JV5 Games.
      Logos and trademarks attributed to their respective owners.
      bluehexagons logo, Antistatic logo, background tile produced by <a href="https://bsky.app/profile/hobith.bsky.social">hobith</a>.
    `;

    footer.appendChild(copyright);
    footer.appendChild(linksContainer);
    this.shadow.appendChild(footer);
  }
}

customElements.define('page-footer', PageFooter);