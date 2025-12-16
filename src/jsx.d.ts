import type { Fragment } from './jsx';

declare global {
  namespace JSX {
    // We return real DOM nodes, not a VDOM.
    type Element = Node;

    interface ElementChildrenAttribute {
      children: {};
    }

    interface IntrinsicElements {
      [elemName: string]: any;
    }

    // Allow <></> fragments.
    interface IntrinsicAttributes {
      children?: any;
    }
  }
}

export {};
