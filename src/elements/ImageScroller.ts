import { BaseElement, createElementWithClass } from './BaseElement';
import imageScrollerStyles from './ImageScroller.css?inline';

const findThumbs = /(thumbs\/|( |\%20)\(Phone\))/g;

export class ImageScrollerElement extends BaseElement {
  container: HTMLDivElement = null;
  gallery: HTMLDivElement = null;
  imageElements: HTMLImageElement[] = [];
  currentImage: HTMLElement = null;
  description: HTMLDivElement = null;
  resizeObserver: ResizeObserver = null;

  constructor() {
    super();
    this.injectStyles(imageScrollerStyles);
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
      this.gallery.appendChild(node);
    } else if (node.nodeName === 'IMG') {
      // for image thumbnails, add a link to the full-size version
      imgElement = node as HTMLImageElement;
      
      if (imgElement.src && !imgElement.src.startsWith('http') && !imgElement.src.startsWith('/')) {
        imgElement.src = '/' + imgElement.src;
      }
      
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
      this.selectImage(imgElement);
    });

    this.resizeObserver.observe(imgElement);
  }

  connectedCallback() {
    const imageScroller = createElementWithClass<HTMLDivElement>('div', 'image_scroller');
    this.shadow.appendChild(imageScroller);

    const container = createElementWithClass<HTMLDivElement>('div', 'image_scroller__container');
    this.container = container;
    imageScroller.appendChild(container);

    const gallery = createElementWithClass<HTMLDivElement>('div', 'image_scroller__gallery');
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

    const descriptionContainer = createElementWithClass<HTMLDivElement>('div', 'image_scroller__description_container');
    container.appendChild(descriptionContainer);

    const description = createElementWithClass<HTMLDivElement>('div', 'image_scroller__description');
    descriptionContainer.appendChild(description);
    this.description = description;

    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target !== this.currentImage) {
          return;
        }
      }
    });
    
    Array.from(this.childNodes).forEach(node => {
      this.appendNode(node.cloneNode(true));
      this.removeChild(node);
    });
  }

  attributeChangedCallback(_name: string, _oldValue: string, _newValue: string) { }
}

customElements.define('image-scroller', ImageScrollerElement);