import { BaseElement } from './BaseElement';
import styles from './ExpandableSection.css?inline';

export class ExpandableSection extends BaseElement {
  private toggleButton: HTMLButtonElement | null = null;
  private contentContainer: HTMLDivElement | null = null;

  constructor() {
    super(styles);
  }

  connectedCallback() {
    const ariaLabel = this.getAttribute('aria-label') || 'Show more';

    let toggleButton: HTMLButtonElement | null = null;
    let contentContainer: HTMLDivElement | null = null;

    this.render(
      <div class="expandable-container">
        <button
          class="expand_toggle"
          type="button"
          aria-expanded="false"
          aria-label={ariaLabel}
          ref={(el) => {
            toggleButton = el as HTMLButtonElement;
          }}
          onClick={() => {
            if (!toggleButton || !contentContainer) return;
            const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
            this.toggle(!isExpanded);
          }}
        ></button>

        <div
          class="expandable-content"
          style={{ display: 'none' }}
          ref={(el) => {
            contentContainer = el as HTMLDivElement;
          }}
        >
          <slot></slot>
        </div>
      </div>
    );

    this.toggleButton = toggleButton;
    this.contentContainer = contentContainer;
  }

  toggle(expanded?: boolean) {
    if (!this.toggleButton || !this.contentContainer) return;

    const isExpanded = expanded !== undefined ? expanded : this.toggleButton.getAttribute('aria-expanded') !== 'true';

    this.toggleButton.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    this.contentContainer.style.display = isExpanded ? 'block' : 'none';
  }
}

customElements.define('expandable-section', ExpandableSection);