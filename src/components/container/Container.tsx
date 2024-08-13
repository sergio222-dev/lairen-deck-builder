import { component$, Slot } from "@builder.io/qwik";

export const Container = component$(() => {
  return (
    <div class="h-full overflow-y-auto">
      <Slot/>
    </div>
  )
});
