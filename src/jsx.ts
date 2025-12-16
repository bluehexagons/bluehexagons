export type JSXChild =
  | Node
  | string
  | number
  | boolean
  | null
  | undefined
  | JSXChild[];

export type JSXProps = Record<string, unknown> & {
  children?: JSXChild;
  ref?: ((el: Element) => void) | null;
};

export const Fragment: unique symbol = Symbol('Fragment');

const isNode = (value: unknown): value is Node =>
  typeof value === 'object' && value !== null && 'nodeType' in (value as Node);

const append = (parent: Node, child: JSXChild): void => {
  if (child == null || child === false || child === true) return;

  if (Array.isArray(child)) {
    for (const nested of child) append(parent, nested);
    return;
  }

  if (isNode(child)) {
    parent.appendChild(child);
    return;
  }

  parent.appendChild(document.createTextNode(String(child)));
};

const setProp = (el: Element, key: string, value: unknown): void => {
  if (key === 'children') return;

  if (key === 'ref') {
    if (typeof value === 'function') (value as (el: Element) => void)(el);
    return;
  }

  if (key === 'className') {
    if (value != null) el.setAttribute('class', String(value));
    return;
  }

  if (key === 'class') {
    if (value != null) el.setAttribute('class', String(value));
    return;
  }

  if (key === 'style') {
    if (value == null) return;
    if (typeof value === 'string') {
      (el as HTMLElement).setAttribute('style', value);
      return;
    }
    if (typeof value === 'object') {
      const style = (el as HTMLElement).style;
      for (const [styleKey, styleValue] of Object.entries(value as Record<string, unknown>)) {
        if (styleValue == null) continue;
        style[styleKey] = String(styleValue);
      }
    }
    return;
  }

  if (key.startsWith('on') && typeof value === 'function') {
    const eventName = key.slice(2).toLowerCase();
    el.addEventListener(eventName, value as EventListener);
    return;
  }

  if (value === false || value == null) return;

  // Prefer properties for common DOM fields when available.
  if (key in el) {
    try {
      (el as any)[key] = value;
      return;
    } catch {
      // fall back to attribute
    }
  }

  if (value === true) {
    el.setAttribute(key, '');
    return;
  }

  el.setAttribute(key, String(value));
};

export function h(type: string | typeof Fragment, props: JSXProps | null, ...children: JSXChild[]): Node {
  if (type === Fragment) {
    const frag = document.createDocumentFragment();
    const allChildren = props?.children != null ? [props.children, ...children] : children;
    for (const child of allChildren) append(frag, child);
    return frag;
  }

  const el = document.createElement(type);

  if (props) {
    for (const [key, value] of Object.entries(props)) setProp(el, key, value);
  }

  const allChildren = props?.children != null ? [props.children, ...children] : children;
  for (const child of allChildren) append(el, child);

  return el;
}
