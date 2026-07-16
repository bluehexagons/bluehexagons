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
    const accessibleLabel = isExternal && ariaLabel ? `${ariaLabel} (opens in a new tab)` : ariaLabel;

    const passthroughAttrs: Record<string, string> = {};
    for (const attr of Array.from(this.attributes)) {
      if (attr.name === 'href' || attr.name === 'aria-label') continue;
      passthroughAttrs[attr.name] = attr.value;
    }

    this.render(
      <a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        aria-label={accessibleLabel || undefined}
        {...passthroughAttrs}
      >
        <slot></slot>
        {isExternal ? <span class="link__new-tab"> (opens in a new tab)</span> : null}
      </a>
    );
  }
}

customElements.define('site-link', Link);
