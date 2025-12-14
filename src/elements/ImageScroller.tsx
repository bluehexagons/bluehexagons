import { BaseElement } from './BaseElement';
import imageScrollerStyles from './ImageScroller.css?inline';

const findThumbs = /thumbs\//g;

export class ImageScrollerElement extends BaseElement {
  container: HTMLDivElement | null = null;
  gallery: HTMLDivElement | null = null;
  imageElements: HTMLImageElement[] = [];
  currentImage: HTMLElement | null = null;
  description: HTMLDivElement | null = null;
  resizeObserver: ResizeObserver | null = null;

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

    if (this.description) {
      this.description.textContent = img.title ?? '';
    }
  }

  appendNode(node: Node) {
    if (!this.gallery) return;

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
      link.href = imgElement.dataset.linkOverride || fullsize;
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

    this.resizeObserver?.observe(imgElement);
  }

  connectedCallback() {
    let container: HTMLDivElement | null = null;
    let gallery: HTMLDivElement | null = null;
    let description: HTMLDivElement | null = null;

    this.render(
      <div class="image_scroller">
        <div
          class="image_scroller__container"
          ref={(el) => {
            container = el as HTMLDivElement;
          }}
        >
          <div
            class="image_scroller__gallery"
            ref={(el) => {
              gallery = el as HTMLDivElement;
            }}
          ></div>

          <div class="image_scroller__description_container">
            <div
              class="image_scroller__description"
              ref={(el) => {
                description = el as HTMLDivElement;
              }}
            ></div>
          </div>
        </div>
      </div>
    );

    this.container = container;
    this.gallery = gallery;
    this.description = description;

    // watch for added nodes and move them to the shadow DOM
    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          this.appendNode(node);
        }
      }
    });

    observer.observe(this, { childList: true });

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