import type { HTMLAttributes, InputHTMLAttributes, JSXOutput, QRL } from "@builder.io/qwik";
import { $, useSignal }                                             from "@builder.io/qwik";
import { Slot }                                                     from "@builder.io/qwik";
import { component$ }                                               from "@builder.io/qwik";
import { ButtonIcon }                                               from "~/components/button";
import { Chip }                                                     from "~/components/chip/Chip";
import { Icon }                                                     from "~/components/icons/Icon";

interface FilterChipProps extends HTMLAttributes<HTMLDivElement> {
}

export const ChipFilter = component$<FilterChipProps>(({ ...props }) => {
  return (
    <Chip class="flex gap-1 hover:bg-red-500 cursor-pointer px-3 py-2 text-white text-sm" {...props}>
      <ButtonIcon class="bg-transparent">
        <Icon name={'close'} width={8} height={8}/>
      </ButtonIcon>
      <Slot/>
    </Chip>
  )
});

interface FilterFieldProps {
  onSubmit?: QRL<(this: FilterFieldProps, value: string | undefined) => Promise<void>>;
  children?: JSXOutput[];
}

export const FilterField = component$<FilterFieldProps>(
  ({
     onSubmit,
   }) => {
    const r = useSignal<HTMLFormElement>();

    const handleSubmit = $(() => {
      // get value
      const value = new FormData(r.value).get('contains');

      r.value?.reset();

      onSubmit?.(value?.toString());
    })

    return (
      <div class="relative w-full rounded-3xl p-2 ring-primary ring-4 focus-within:ring-secondary flex gap-2 flex-wrap">
        <Slot/>
        <form
          ref={r}
          class="w-full flex-1 min-w-[200px]"
          onSubmit$={handleSubmit}
          preventdefault:submit>
          <input
            name="contains"
            autocomplete="off"
            class="focus:outline-none flex-1 w-full"
            type="text"
          />
        </form>
      </div>
    )
  });
