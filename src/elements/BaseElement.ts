import cssStyles from '../css.css?inline';

export abstract class BaseElement extends HTMLElement {
  protected shadow: ShadowRoot;
  protected stylesRoot: HTMLElement;
  protected contentRoot: HTMLElement;
  
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });

    this.stylesRoot = document.createElement('div');
    this.stylesRoot.setAttribute('data-root', 'styles');
    this.shadow.appendChild(this.stylesRoot);

    this.contentRoot = document.createElement('div');
    this.contentRoot.setAttribute('data-root', 'content');
    this.shadow.appendChild(this.contentRoot);

    this.injectStyles(cssStyles);
  }
  
  protected injectStyles(...sheets: string[]): void {
    for (const sheet of sheets) {
      const style = document.createElement('style');
      style.textContent = `${sheet}`;
      this.stylesRoot.appendChild(style);
    }
  }

  protected render(node: Node): void {
    this.contentRoot.replaceChildren(node);
  }
}

export const createElementWithClass = <T extends HTMLElement>(tagName: string, className: string): T => {
  const element = document.createElement(tagName) as T;
  element.className = className;
  return element;
};