import cssStyles from '../css.css?inline';

export abstract class BaseElement extends HTMLElement {
  protected shadow: ShadowRoot;
  
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.injectStyles(cssStyles);
  }
  
  protected injectStyles(...sheets: string[]): void {
    for (const sheet of sheets) {
      const style = document.createElement('style');
      style.textContent = `${sheet}`;
      this.shadow.appendChild(style);
    }
  }
}

export const createElementWithClass = <T extends HTMLElement>(tagName: string, className: string): T => {
  const element = document.createElement(tagName) as T;
  element.className = className;
  return element;
};