import { atom } from "nanostores";
import { createRef, h } from "./jsx";

export const counter = atom(0);

export const Counter = () => {
  let ref = createRef<HTMLParagraphElement>();

  counter.subscribe((value) => {
    ref.current && (ref.current.textContent = `Counter: ${value}`);
    console.log("counter", value, ref.current);
  });

  return (
    <div>
      <p ref={ref}> Counter: {counter.get()}</p>
      <button onclick={() => counter.set(counter.get() + 1)}>+</button>
    </div>
  );
};
