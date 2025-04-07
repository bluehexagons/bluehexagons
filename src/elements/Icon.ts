import { BaseElement, createElementWithClass } from './BaseElement';
import iconStyles from './Icon.css?inline';

export class IconElement extends BaseElement {
  static observedAttributes = ['name'];
  container: HTMLSpanElement = null;
  image: HTMLImageElement = null;

  constructor() {
    super();
    this.injectStyles(iconStyles);
    
    const container = createElementWithClass<HTMLSpanElement>('span', 'icon_img');
    this.container = container;
    this.shadow.appendChild(container);

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

    this.image.src = `/assets/icons/${iconName}${iconName.endsWith('.png') ? '' : '.svg'}`;
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