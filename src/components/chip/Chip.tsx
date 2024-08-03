import type { HTMLAttributes} from "@builder.io/qwik";
import { component$, Slot } from "@builder.io/qwik";

export const Chip = component$<HTMLAttributes<HTMLDivElement>>(({ class: className, ...props }) => {
  return (
    <div class={`rounded-3xl bg-secondary px-2 py-1 text-black ${className}`} {...props}>
      <Slot />
    </div>
  );
});
