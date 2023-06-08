export const createRef = <T>(): { current: T | null } => {
  let ref: any = null;
  return new Proxy(
    {
      current: null,
    },
    {
      get: (_, key) => {
        if (key === "current") {
          return ref;
        } else {
          return (node: T) => {
            ref = node;
          };
        }
      },
      set: (_, key, value) => {
        if (key === "current") {
          ref = value;
        }
        return true;
      },
    }
  );
};

export const h = (tag: string | Function, props: any, ...children: any[]) => {
  if (typeof tag === "function") {
    return tag(props, children);
  }

  const node = document.createElement(tag);

  !props && (props = {});

  let { ref, ...otherProps } = props;
  Object.assign(node, otherProps);

  if (ref) {
    if (typeof ref === "function") {
      ref(node);
    } else {
      ref.current = node;
    }
  }

  const processed = children.reduce(
    (acc, child) => {
      if (typeof child === "function") {
        const textNode = document.createTextNode("");

        acc.textNodes.push(() => {
          const result = child();
          textNode.textContent = result;
        });

        acc.children.push(textNode);
        return acc;
      } else {
        acc.children.push(child);
        return acc;
      }
    },
    {
      children: [],
      textNodes: [],
    }
  ) as { children: any[]; textNodes: Function[] };

  processed.textNodes.forEach((textNode) => createEffect(textNode));

  node.append(...processed.children);

  return node;
};

export const Fragment = ({ children }: { children: any[] }) => {
  return children;
};

export const render = (vdom: any, container: HTMLElement) => {
  container.append(vdom);
};

// Signals

const effectStack: Function[] = [];

export const createEffect = (fn: Function) => {
  effectStack.push(fn);
  fn();
  effectStack.pop();
};

export class Signal<T> {
  private _value: T;
  private effects: Set<Function>;
  constructor(value: T) {
    this._value = value;
    this.effects = new Set();
  }

  get value() {
    if (!effectStack.length) {
      return this._value;
    }
    const activeEffect = <Function>effectStack.at(-1);

    this.effects.add(activeEffect);
    return this._value;
  }

  set value(v: T) {
    this._value = v;
    queueEffect(this.effects);
  }
}

let queued = false;
const reactionQueue = new Set<Function>();

const queueEffect = (fns: Set<Function>) => {
  fns.forEach((fn) => reactionQueue.add(fn));
  if (queued) return;

  queued = true;
  queueMicrotask(() => {
    reactionQueue.forEach((fn) => fn());
    reactionQueue.clear();
    queued = false;
  });
};

export const createSignal = <T>(value: T) => {
  const sig = new Signal(value);

  const signal = (v?: T) => {
    if (!v) return sig.value;
    else sig.value = v;
  };

  return signal;
};

export const isSignal = (v: any) => v instanceof Signal;
