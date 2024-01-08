'use strict';
const findThumbs = /(thumbs\/|( |\%20)\(Phone\))/g;
class ImageScroller extends HTMLElement {
    constructor() {
        super();
        this.container = null;
        this.gallery = null;
        this.imageElements = [];
        this.currentImage = null;
        this.description = null;
    }
    selectImage(img) {
        var _a;
        if (this.currentImage) {
            this.currentImage.classList.remove('highlighted');
        }
        this.currentImage = img;
        this.currentImage.classList.add('highlighted');
        this.description.textContent = (_a = img.title) !== null && _a !== void 0 ? _a : '';
    }
    appendNode(node) {
        var _a;
        let imgElement = null;
        if (node.nodeName === 'A' && ((_a = node.firstChild) === null || _a === void 0 ? void 0 : _a.nodeName) === 'IMG') {
            imgElement = node.firstChild;
            this.gallery.appendChild(node);
        }
        else if (node.nodeName === 'IMG') {
            imgElement = node;
            const thumbnail = imgElement.src;
            const fullsize = thumbnail.replace(findThumbs, '');
            const link = document.createElement('a');
            link.href = fullsize;
            this.gallery.appendChild(link);
            link.appendChild(imgElement);
        }
        else {
            this.gallery.appendChild(node);
            return;
        }
        this.imageElements.push(imgElement);
        if (!this.currentImage) {
            this.selectImage(imgElement);
        }
        imgElement.addEventListener('mouseenter', () => {
            this.selectImage(imgElement);
        });
        imgElement.addEventListener('touchstart', () => {
            this.selectImage(imgElement);
        });
    }
    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        const style = document.createElement('link');
        style.rel = 'stylesheet';
        style.href = 'assets/css.css';
        shadow.appendChild(style);
        const container = document.createElement('div');
        this.container = container;
        shadow.appendChild(container);
        const gallery = document.createElement('div');
        gallery.className = 'image-scroller';
        this.gallery = gallery;
        container.appendChild(gallery);
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    this.appendNode(node);
                }
            }
        });
        observer.observe(this, { childList: true });
        const description = document.createElement('div');
        description.className = 'image-scroller__description';
        shadow.appendChild(description);
        this.description = description;
    }
    attributeChangedCallback(_name, _oldValue, _newValue) { }
}
ImageScroller.observedAttributes = ['color', 'size'];
customElements.define('image-scroller', ImageScroller);
//# sourceMappingURL=elements.js.map