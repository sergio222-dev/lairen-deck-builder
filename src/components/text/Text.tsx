import type { InputHTMLAttributes } from '@builder.io/qwik';
import { component$ }               from '@builder.io/qwik';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Text = component$<InputProps>(({ ...props }) => {
  return (
    <input {...props} type="text" class={`ring-2 outline-none p-2 focus:ring-(--qwik-secondary) rounded ${props.class}`}/>
  )
});
