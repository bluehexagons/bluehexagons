declare namespace JSX {
  type Element = Node;

  interface ElementChildrenAttribute {
    children: {};
  }

  interface IntrinsicElements {
    [elemName: string]: any;
  }

  interface IntrinsicAttributes {
    children?: any;
  }
}
