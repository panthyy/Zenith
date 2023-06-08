declare namespace JSX {
  // The return type of our JSX Factory: this could be anything
  type Element = HTMLElement;

  // IntrinsicElementMap grabs all the standard HTML tags in the TS DOM lib.
  interface IntrinsicElements extends IntrinsicElementMap {}

  // The following are custom types, not part of TS's known JSX namespace:
  type IntrinsicElementMap = {
    [K in keyof HTMLElementTagNameMap]:
      | {
          [P in keyof HTMLElementTagNameMap[K]]?:
            | HTMLElementTagNameMap[K][P]
            | string
            | number;
        }
      | { ref: any }
      | number;
  };

  interface Component {
    (properties?: { [key: string]: string | number }, children?: Node[]): Node;
  }
}
