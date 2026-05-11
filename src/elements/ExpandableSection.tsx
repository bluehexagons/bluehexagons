import { BaseElement } from './BaseElement';
import styles from './ExpandableSection.css?inline';

let expandableSectionId = 0;

export class ExpandableSection extends BaseElement {
  private toggleButton: HTMLButtonElement | null = null;
  private contentContainer: HTMLDivElement | null = null;
  private contentInner: HTMLDivElement | null = null;
  private resizeObserver: ResizeObserver | null = null;

  constructor() {
    super(styles);
  }

  connectedCallback() {
    const ariaLabel = this.getAttribute('aria-label') || 'Show more';
    const contentId = `expandable-${++expandableSectionId}`;

    let toggleButton: HTMLButtonElement | null = null;
    let contentContainer: HTMLDivElement | null = null;
    let contentInner: HTMLDivElement | null = null;
    this.render(
      <div class="expandable-container">
        <div
          id={contentId}
          class="expandable-content"
          ref={(el: Element) => {
            contentContainer = el as HTMLDivElement;
          }}
        >
          <div
            class="expandable-content__inner"
            ref={(el: Element) => {
              contentInner = el as HTMLDivElement;
            }}
          >
            <slot
              onSlotchange={() => {
                this.updateExpandableState();
              }}
            ></slot>
          </div>
        </div>

        <button
          class="expand_toggle"
          type="button"
          aria-expanded="false"
          aria-label={ariaLabel}
          aria-controls={contentId}
          ref={(el: Element) => {
            toggleButton = el as HTMLButtonElement;
          }}
          onClick={() => {
            if (!toggleButton || !contentContainer) return;
            const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
            this.toggle(!isExpanded);
          }}
        ></button>
      </div>
    );

    this.toggleButton = toggleButton;
    this.contentContainer = contentContainer;
    this.contentInner = contentInner;

    if ('ResizeObserver' in window && this.contentInner) {
      this.resizeObserver = new ResizeObserver(() => {
        this.updateExpandableState();
      });
      this.resizeObserver.observe(this.contentInner);
    }

    requestAnimationFrame(() => {
      this.updateExpandableState();
    });
  }

  toggle(expanded?: boolean) {
    if (!this.toggleButton || !this.contentContainer) return;

    const isExpanded = expanded !== undefined ? expanded : this.toggleButton.getAttribute('aria-expanded') !== 'true';

    this.toggleButton.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    this.contentContainer.classList.toggle('expanded', isExpanded);

    if (isExpanded) {
      this.setExpandedHeight();
    } else {
      this.contentContainer.style.maxHeight = '';
    }
  }

  disconnectedCallback() {
    this.resizeObserver?.disconnect();
  }

  private updateExpandableState() {
    if (!this.toggleButton || !this.contentContainer || !this.contentInner) return;

    const hasOverflow = this.getContentHeight() > this.getPreviewHeight() + 1;
    this.contentContainer.classList.toggle('fits-content', !hasOverflow);
    this.toggleButton.hidden = !hasOverflow;

    if (!hasOverflow) {
      this.toggleButton.setAttribute('aria-expanded', 'false');
      this.contentContainer.classList.remove('expanded');
      this.contentContainer.style.maxHeight = '';
      return;
    }

    if (this.toggleButton.getAttribute('aria-expanded') === 'true') {
      this.setExpandedHeight();
    } else {
      this.contentContainer.style.maxHeight = '';
    }
  }

  private getPreviewHeight() {
    if (!this.contentContainer) return 0;
    const value = getComputedStyle(this.contentContainer).getPropertyValue('--preview-height').trim();
    const parsed = Number.parseFloat(value);

    if (value.endsWith('rem')) {
      return parsed * Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
    }

    if (value.endsWith('px')) {
      return parsed;
    }

    return this.contentContainer.clientHeight;
  }

  private setExpandedHeight() {
    if (!this.contentContainer || !this.contentInner) return;
    this.contentContainer.style.maxHeight = `${this.getContentHeight()}px`;
  }

  private getContentHeight() {
    if (!this.contentInner) return 0;
    return Math.ceil(Math.max(this.contentInner.scrollHeight, this.contentInner.getBoundingClientRect().height)) + 1;
  }
}

customElements.define('expandable-section', ExpandableSection);
