import { BaseElement } from './BaseElement';
import iconStyles from './Icon.css?inline';

export class IconElement extends BaseElement {
  static observedAttributes = ['name'];
  container: HTMLSpanElement | null = null;
  image: HTMLImageElement | null = null;

  constructor() {
    super(iconStyles);
  }
  
  changeIcon(iconName: string) {
    if (!this.container || !this.image) return;

    if (!iconName) {
      this.image.removeAttribute('src');
      this.image.style.display = 'none';
      return;
    }

    this.image.style.display = '';
    this.image.src = `/assets/icons/${iconName}${iconName.endsWith('.png') ? '' : '.svg'}`;
  }

  connectedCallback() {
    let container: HTMLSpanElement | null = null;
    let image: HTMLImageElement | null = null;

    this.render(
      <span
        class="icon_img"
        ref={(el) => {
          container = el as HTMLSpanElement;
        }}
      >
        <img
          width={16}
          ref={(el) => {
            image = el as HTMLImageElement;
          }}
        />
      </span>
    );

    this.container = container;
    this.image = image;

    this.changeIcon(this.getAttribute('name') || '');
  }

  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    switch (name) {
      case 'name':
        this.changeIcon(newValue);
        break;
    }
  }
}

customElements.define('icon-img', IconElement);