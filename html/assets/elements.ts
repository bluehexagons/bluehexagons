'use strict';

const findThumbs = /(thumbs\/|( |\%20)\(Phone\))/g;

const addStylesheet = (shadow: ShadowRoot) => {
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = 'assets/css.css';
  shadow.appendChild(style);
}

class ImageScrollerElement extends HTMLElement {
  static observedAttributes = [];
  container: HTMLDivElement = null;
  gallery: HTMLDivElement = null;
  imageElements: HTMLImageElement[] = [];
  currentImage: HTMLElement = null;
  description: HTMLDivElement = null;
  resizeObserver: ResizeObserver = null;

  constructor() {
    super();
  }

  updateDescriptionPosition() {
    this.description.style.transform = `translateX(${this.currentImage.offsetLeft || 0}px)`;
    this.description.style.maxWidth = `${this.currentImage.offsetWidth}px`;
  }

  selectImage(img: HTMLImageElement) {
    if (this.currentImage) {
      this.currentImage.classList.remove('highlighted');
    }

    this.currentImage = img;
    this.currentImage.classList.add('highlighted');

    this.description.textContent = img.title ?? '';

    this.updateDescriptionPosition();
  }

  appendNode(node: Node) {
    let imgElement: HTMLImageElement = null;

    if (node.nodeName === 'A' && node.firstChild?.nodeName === 'IMG') {
      imgElement = node.firstChild as HTMLImageElement;
      this.gallery.appendChild(node);
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
      if (this.currentImage === imgElement) {
        return;
      }

      this.selectImage(imgElement);
      this.currentImage.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    });

    imgElement.addEventListener('touchstart', () => {
      // yeah, this isn't a great way to do this
      this.selectImage(imgElement);
    });

    this.resizeObserver.observe(imgElement);
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });

    // for now, do it the hacky way
    addStylesheet(shadow);

    const imageScroller = document.createElement('div');
    imageScroller.className = 'image_scroller';
    shadow.appendChild(imageScroller);

    const container = document.createElement('div');
    this.container = container;
    container.className = 'image_scroller__container';
    imageScroller.appendChild(container);


    const gallery = document.createElement('div');
    gallery.className = 'image_scroller__gallery';
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
    description.className = 'image_scroller__description';
    container.appendChild(description);
    this.description = description;

    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target !== this.currentImage) {
          return;
        }

        this.updateDescriptionPosition();
      }
    });
  }

  attributeChangedCallback(_name: string, _oldValue: string, _newValue: string) { }
}

customElements.define('image-scroller', ImageScrollerElement);

class IconElement extends HTMLElement {
  static observedAttributes = ['name'];
  container: HTMLSpanElement = null;
  image: HTMLImageElement = null;

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    addStylesheet(shadow);

    const container = document.createElement('span');
    this.container = container;
    container.className = 'icon_img';
    shadow.appendChild(container);

    const image = new Image();
    image.width = 16;
    this.image = image;
  }

  changeIcon(iconName: string) {
    if (!iconName) {
      if (this.container.firstChild) {
        this.container.removeChild(this.image);
      }

      return;
    }

    if (!this.container.firstChild) {
      this.container.appendChild(this.image);
    }

    this.image.src = `assets/icons/${iconName}${iconName.endsWith('.png') ? '' : '.svg'}`;
  }

  connectedCallback() { }

  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    switch (name) {
      case 'name':
        this.changeIcon(newValue);
        break;
    }
  }
}

customElements.define('icon-img', IconElement);
