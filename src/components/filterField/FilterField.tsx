import type { HTMLAttributes, JSXOutput, QRL }        from "@builder.io/qwik";
import { $, component$, Slot, useContext, useSignal } from "@builder.io/qwik";
import { Button }                                     from "~/components/button";
import { Chip }                                       from "~/components/chip/Chip";
import { CATEGORY_FILTERS }                           from "~/UI/filters/models/filterDefinition.model";
import { FILTER_CONTEXT }                             from "~/UI/filters/store/filter.store";

interface FilterChipProps extends HTMLAttributes<HTMLDivElement> {
}

export const ChipFilter = component$<FilterChipProps>(({ ...props }) => {
    return (
            <Chip class="flex text-[8px] sm:text-sm gap-1 hover:bg-red-500 cursor-pointer px-3 py-1 max-w-[100px] sm:max-w-[150px]" {...props}>
      <span class="whitespace-nowrap overflow-hidden overflow-ellipsis">
        <Slot/>
      </span>
            </Chip>
    )
});

interface FilterFieldProps {
    onSubmit?: QRL<(value: string) => Promise<void>>;
    children?: JSXOutput[];
    onClear?: QRL<() => Promise<void>>;
}

export const FilterField = component$<FilterFieldProps>(
        ({
             onSubmit,
             onClear,
         }) => {
            const r = useSignal<HTMLFormElement>();
            const f = useContext(FILTER_CONTEXT);

            const handleSubmit = $(() => {
                // get value
                const value = new FormData(r.value).get('contains');

                r.value?.reset();

                onSubmit?.(value?.toString() ?? '');
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
                                    class="focus:outline-none bg-transparent flex-1 w-full"
                                    type="text"
                                    placeholder="Type to filter..."
                                    onKeyDown$={handleClear}
                            />
                        </form>
                        <Button class="rounded-3xl" onClick$={$(() => f.toggleDominion())}>
                            {f.dominion ? 'Dominion' : 'Eterno'}
                        </Button>
                        <Button
                                onClick$={$(() => f.toggleExclusive(CATEGORY_FILTERS.TEXT))}
                                class="rounded-3xl"
                        >
                            {f.filterGroups[CATEGORY_FILTERS.TEXT].exclusive ? 'Exclusive' : 'Inclusive'}
                        </Button>
                    </div>
            )
        });
