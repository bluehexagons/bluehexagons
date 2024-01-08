'use strict';

const findThumbs = /(thumbs\/|( |\%20)\(Phone\))/g;

class ImageScroller extends HTMLElement {
  static observedAttributes = ['color', 'size'];
  container: HTMLDivElement = null;
  imageElements: HTMLImageElement[] = [];

  constructor() {
    super();
  }

  appendNode(node: Node) {
    if (node.nodeName !== 'IMG') {
      // for now, only accept images
      return;
    }

    const img = node as HTMLImageElement;
    const link = document.createElement('a');
    const thumbnail = img.src;
    const fullsize = thumbnail.replace(findThumbs, '');
    link.href = fullsize;
    this.container.appendChild(link);
    link.appendChild(img);

    this.imageElements.push(img);
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });

    // for now, do it the hacky way
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = 'assets/css.css';
    shadow.appendChild(style);

    const container = document.createElement('div');
    container.className = 'image-scroller';
    this.container = container;
    shadow.appendChild(container);

    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          this.appendNode(node);
        }
      }
    });

    observer.observe(this, { childList: true });
  }

  attributeChangedCallback(_name: string, _oldValue: string, _newValue: string) { }
}

customElements.define('image-scroller', ImageScroller);
