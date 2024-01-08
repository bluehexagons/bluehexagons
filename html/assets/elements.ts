'use strict';

const findThumbs = /(thumbs\/|( |\%20)\(Phone\))/g;

class ImageScroller extends HTMLElement {
  static observedAttributes = ['color', 'size'];
  container: HTMLDivElement = null;
  gallery: HTMLDivElement = null;
  imageElements: HTMLImageElement[] = [];
  currentImage: HTMLElement = null;
  description: HTMLDivElement = null;

  constructor() {
    super();
  }

  selectImage(img: HTMLImageElement) {
    if (this.currentImage) {
      this.currentImage.classList.remove('highlighted');
    }

    this.currentImage = img;
    this.currentImage.classList.add('highlighted');

    this.description.textContent = img.title ?? '';
  }

  appendNode(node: Node) {
    let imgElement: HTMLImageElement = null;

    if (node.nodeName === 'A' && node.firstChild?.nodeName === 'IMG') {
      imgElement = node.firstChild as HTMLImageElement;
      this.gallery.appendChild(node)
    } else if (node.nodeName === 'IMG') {
      // for image thumbnails, add a link to the full-size version

      imgElement = node as HTMLImageElement;
      const thumbnail = imgElement.src;
      const fullsize = thumbnail.replace(findThumbs, '');

      const link = document.createElement('a');
      link.href = fullsize;
      this.gallery.appendChild(link);
      link.appendChild(imgElement);
    } else {
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
      // yeah, this isn't a great way to do this
      this.selectImage(imgElement);
    });
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });

    // for now, do it the hacky way
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

    // watch for added nodes and move them to the shadow DOM
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

  attributeChangedCallback(_name: string, _oldValue: string, _newValue: string) { }
}

customElements.define('image-scroller', ImageScroller);
