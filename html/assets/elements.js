'use strict';
const findThumbs = /(thumbs\/|( |\%20)\(Phone\))/g;
class ImageScroller extends HTMLElement {
    constructor() {
        super();
        this.container = null;
    }
    appendNode(node) {
        if (node.nodeName !== 'IMG') {
            return;
        }
        const img = node;
        const link = document.createElement('a');
        const thumbnail = img.src;
        const fullsize = thumbnail.replace(findThumbs, '');
        link.href = fullsize;
        this.container.appendChild(link);
        link.appendChild(img);
    }
    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        const style = document.createElement('link');
        style.rel = 'stylesheet';
        style.href = 'assets/css.css';
        shadow.appendChild(style);
        const container = document.createElement('div');
        container.className = 'image-scroller';
        this.container = container;
        shadow.appendChild(container);
        var observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    this.appendNode(node);
                }
            }
        });
        observer.observe(this, { childList: true });
    }
    attributeChangedCallback(_name, _oldValue, _newValue) {
    }
}
ImageScroller.observedAttributes = ['color', 'size'];
customElements.define('image-scroller', ImageScroller);
//# sourceMappingURL=elements.js.map