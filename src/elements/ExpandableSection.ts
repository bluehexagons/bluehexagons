import { BaseElement } from './BaseElement';

export class ExpandableSection extends BaseElement {
  private contentSlot: HTMLSlotElement | null = null;
  private toggleButton: HTMLButtonElement | null = null;

  constructor() {
    super();

    const style = document.createElement('style');
    style.textContent = `
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
    `;
    this.shadow.appendChild(style);
  }

  connectedCallback() {
    const container = document.createElement('div');
    container.className = 'expandable-container';
    
    const toggle = document.createElement('button');
    toggle.className = 'expand_toggle';
    toggle.setAttribute('type', 'button');
    toggle.setAttribute('aria-expanded', 'false');
    
    const ariaLabel = this.getAttribute('aria-label') || 'Show more';
    toggle.setAttribute('aria-label', ariaLabel);
    
    const contentContainer = document.createElement('div');
    contentContainer.className = 'expandable-content';
    
    const contentSlot = document.createElement('slot');
    contentContainer.appendChild(contentSlot);
    this.contentSlot = contentSlot;

    toggle.addEventListener('click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
      contentContainer.style.display = isExpanded ? 'none' : 'block';
    });
    
    contentContainer.style.display = 'none';
    
    container.appendChild(toggle);
    container.appendChild(contentContainer);
    this.shadow.appendChild(container);
    
    this.toggleButton = toggle;
  }

  toggle(expanded?: boolean) {
    if (!this.toggleButton) return;
    
    const isExpanded = expanded !== undefined ? 
      expanded : 
      this.toggleButton.getAttribute('aria-expanded') !== 'true';
    
    this.toggleButton.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    
    if (this.contentSlot) {
      const contentContainer = this.contentSlot.parentElement;
      if (contentContainer) {
        contentContainer.style.display = isExpanded ? 'block' : 'none';
      }
    }
  }
}

customElements.define('expandable-section', ExpandableSection);