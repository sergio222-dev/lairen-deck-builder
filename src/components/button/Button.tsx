import { component$, Slot } from "@builder.io/qwik";

interface ButtonProps {
}

export const Button = component$<ButtonProps>(() => {
  return (
    <button class="bg-secondary rounded px-4 py-1"><Slot/></button>
  )
});
