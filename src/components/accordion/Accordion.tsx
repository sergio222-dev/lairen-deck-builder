import { component$, Slot, useSignal } from "@builder.io/qwik";

interface AccordionProps {
  title: string;
  quantity?: number;
}

export const Accordion = component$<AccordionProps>(({ title, quantity }) => {

  const isOpen = useSignal(false)

  return (
    <div class="rounded">
      <hr />
      <div class="flex items-center justify-between cursor-pointer hover:bg-primary hover:text-white hover:fill-white px-2 py-4" onClick$={() => isOpen.value = !isOpen.value}>
        <p class="text-lg font-bold flex-1">{title}</p>
        <p>{quantity}</p>
      </div>
      <div hidden={!isOpen.value} class="px-2">
        <Slot/>
      </div>
      <hr />
    </div>
  )
});
