import type { HTMLAttributes, JSXOutput, QRL } from "@builder.io/qwik";
import { $, useSignal }                        from "@builder.io/qwik";
import { Slot }                                from "@builder.io/qwik";
import { component$ }                          from "@builder.io/qwik";
import { ButtonIcon }                          from "~/components/button";
import { Chip }                                from "~/components/chip/Chip";
import { Icon }                                from "~/components/icons/Icon";

interface FilterChipProps extends HTMLAttributes<HTMLDivElement> {
}

export const ChipFilter = component$<FilterChipProps>(({ ...props }) => {
  return (
    <Chip class="flex gap-1 hover:bg-red-500 cursor-pointer px-3 py-1 text-white text-sm max-w-[150px]" {...props}>
      <ButtonIcon class="bg-transparent">
        <Icon name={'close'} width={8} height={8}/>
      </ButtonIcon>
      <span class="whitespace-nowrap overflow-hidden overflow-ellipsis">
        <Slot/>
      </span>
    </Chip>
  )
});

interface FilterFieldProps {
  onSubmit?: QRL<(value: string | undefined) => Promise<void>>;
  children?: JSXOutput[];
  onClear?: QRL<() => Promise<void>>;
}

export const FilterField = component$<FilterFieldProps>(
  ({
     onSubmit,
     onClear,
   }) => {
    const r = useSignal<HTMLFormElement>();

    const handleSubmit = $(() => {
      // get value
      const value = new FormData(r.value).get('contains');

      r.value?.reset();

      onSubmit?.(value?.toString());
    })

    const handleClear = $((e: KeyboardEvent) => {
      if (e.key === 'Backspace' && (e.target as HTMLInputElement).value === '') {
        onClear && onClear();
      }
    })

    return (
      <div class="relative items-center w-full rounded-3xl px-4 py-2 min-h-[40px] ring-primary ring-4 focus-within:ring-secondary flex gap-2 flex-wrap">
        <Slot/>
        <form
          ref={r}
          class="w-full flex-1 items-center flex"
          onSubmit$={handleSubmit}
          preventdefault:submit>
          <input
            name="contains"
            autocomplete="off"
            class="focus:outline-none flex-1 w-full"
            type="text"
            placeholder="Type to filter..."
            onKeyDown$={handleClear}
          />
        </form>
      </div>
    )
  });
