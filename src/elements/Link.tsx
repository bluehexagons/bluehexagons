import { BaseElement } from './BaseElement';
import linkStyles from './Link.css?inline';

export class Link extends BaseElement {
  constructor() {
    super(linkStyles);
  }

  connectedCallback() {
    const href = this.getAttribute('href');
    if (!href) return;

    const isExternal = /^(https?:)?\/\//.test(href);
    const ariaLabel = this.hasAttribute('aria-label')
      ? this.getAttribute('aria-label')
      : this.hasAttribute('title')
        ? this.getAttribute('title')
        : null;

    const passthroughAttrs: Record<string, string> = {};
    for (const attr of Array.from(this.attributes)) {
      if (attr.name === 'href') continue;
      passthroughAttrs[attr.name] = attr.value;
    }

    this.render(
      <a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        aria-label={ariaLabel || undefined}
        {...passthroughAttrs}
      >
        <slot></slot>
      </a>
    );
  }
}

customElements.define('site-link', Link);
