import { BaseElement } from './BaseElement';

export class ExpandableSection extends BaseElement {
  private toggleButton: HTMLButtonElement | null = null;
  private contentContainer: HTMLDivElement | null = null;

  constructor() {
    super();
    this.injectStyles(`
      .expandable-container {
        width: 100%;
        margin: 10px 0;
      }

      .expand_toggle {
        vertical-align: middle;
        appearance: none;
        background: none;
        border: 0;
        outline: 0;
        cursor: pointer;
        font-weight: bold;
        margin-bottom: 20px;
        color: var(--dim-highlight, rgb(0, 134, 151));
        padding: 5px;
        text-align: left;
      }

      .expand_toggle::before {
        content: '(more...)';
        font-size: 17px;
        text-decoration: underline;
        color: white;
      }

      .expand_toggle[aria-expanded="true"]::before {
        content: '(less)';
        font-style: italic;
        font-weight: lighter;
      }

      .expandable-content {
        transition: max-height 0.3s ease-in-out;
      }

      @media (max-width: 660px) {
        .expand_toggle {
          display: block;
          width: 100%;
          text-align: center;
        }
      }
    `);
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