import { BaseElement } from './BaseElement';
import contentAreaStyles from './ContentArea.css?inline';

export class ContentArea extends BaseElement {
  constructor() {
    super();
    this.injectStyles(contentAreaStyles);
  }

  connectedCallback() {
    const contentArea = document.createElement('div');
    contentArea.className = 'content_area';
    
    const background = document.createElement('div');
    background.className = 'content_area__background';
    contentArea.appendChild(background);
    
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'content_wrapper';
    
    const contentSlot = document.createElement('slot');
    contentSlot.name = 'content';
    
    contentWrapper.appendChild(contentSlot);
    
    contentArea.appendChild(contentWrapper);

    this.shadow.appendChild(contentArea);
  }
}

customElements.define('content-area', ContentArea);