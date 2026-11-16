import { BaseElement } from './BaseElement';
import pageHeaderStyles from './PageHeader.css?inline';
import { navigationLinks } from '../site';

export class PageHeader extends BaseElement {
  constructor() {
    super(pageHeaderStyles);
  }

  connectedCallback() {
    const links = navigationLinks(import.meta.env.BASE_URL, window.location.pathname);
    this.render(
      <nav class="navbar" aria-label="Primary navigation">
        <span class="nav">
          {links.map(link => (
            <a href={link.href} aria-current={link.current ? 'page' : undefined}>{link.label}</a>
          ))}
        </span>
      </nav>
    );
  }
}

customElements.define('page-header', PageHeader);
