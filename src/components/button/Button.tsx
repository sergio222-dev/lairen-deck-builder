import type { ButtonHTMLAttributes } from "@builder.io/qwik";
import { component$, Slot }                          from "@builder.io/qwik";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>  {
}

export const Button = component$<ButtonProps>(({ class: className, ...props}) => {
  return (
    <button class={`bg-secondary rounded px-4 py-2 disabled:bg-gray-400 ${className}`} {...props}><Slot/></button>
  )
});
