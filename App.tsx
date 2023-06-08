import { createSignal, h } from "./jsx";

export const App = () => {
  const num = createSignal(0);

  return (
    <div>
      <h2>Home {() => num() * 2} </h2>
      <button
        onclick={() => {
          console.log("click");
          num(num()! + 1);
        }}
      >
        Increment
      </button>
    </div>
  );
};
