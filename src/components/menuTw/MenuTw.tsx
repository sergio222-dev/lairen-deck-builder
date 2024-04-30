import type {
    QRL,
    Signal} from '@builder.io/qwik';
import {
    $,
    component$,
    createContextId,
    Slot,
    useContextProvider,
    useOnDocument,
    useSignal,
    useTask$
} from '@builder.io/qwik';

export const SelectContext = createContextId<Signal<string[]>>('select-context');

interface MenuProps {
    onChange?: QRL<(values: string[]) => void>;
    form?: HTMLFormElement;
}

export const MenuTw = component$<MenuProps>(({ onChange, form }) => {
    const selected = useSignal([]);
    const isOpen = useSignal(false);
    useContextProvider(SelectContext, selected);

    useTask$(({ track }) => {
        track(() => selected.value);

        if (onChange) onChange(selected.value);

        if (typeof window === "undefined") return;
        if (form) form.dispatchEvent(new Event('change'));
    })

    useOnDocument('click', $((e: Event) => {
        if (e.target && !document.querySelector('.menu')?.contains(e.target as Node)) isOpen.value = false;
    }))

    return (
        <div class="menu w-full md:w-fit inline-flex flex-col items-center">
            <div class="w-full px-4">
                <div tab-index="0" role="combobox" aria-activedescendant="" aria-expanded={isOpen.value} class="flex flex-col items-center relative">
                    <div class="w-full  svelte-1l8159u">
                        <div class="my-2 p-1 flex border border-gray-200 bg-white rounded svelte-1l8159u">
                            <div class="flex flex-auto flex-wrap min-w-[200px]">
                                {/* {selected.value.length < 1 && <div> Subtypes </div>} */}
                                {selected.value.map(s => (
                                    <div
                                        key={s}
                                        class="flex justify-center items-center m-1 font-medium py-1 px-2 bg-white rounded-full text-teal-700 border border-teal-300 ">
                                        <div class="text-xs font-normal leading-none max-w-full flex-initial">{s}</div>
                                        <div onClick$={() => selected.value = selected.value.filter((value) => value !== s) } class="flex flex-auto flex-row-reverse">
                                            <div>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24"
                                                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                                    class="feather feather-x cursor-pointer hover:text-teal-400 rounded-full w-4 h-4 ml-2">
                                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {/*<div class="flex-1">*/}
                                {/*  <input placeholder=""*/}
                                {/*         class="bg-transparent p-1 px-2 appearance-none outline-none h-full w-full text-gray-800" />*/}
                                {/*</div>*/}
                            </div>
                            <div class="text-gray-300 w-8 py-1 pl-2 pr-1 border-l flex items-center border-gray-200 svelte-1l8159u">
                                <button preventdefault:click onClick$={() => (isOpen.value = !isOpen.value)} class="cursor-pointer w-6 h-6 text-gray-600 outline-none focus:outline-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                        class="feather feather-chevron-up w-4 h-4">
                                        <polyline points="18 15 12 9 6 15"></polyline>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div
                        class={`${isOpen.value ? '' : 'hidden'} absolute shadow top-[100%] bg-white z-40 w-full lef-0 rounded max-h-select overflow-y-auto`}>
                        <div role="listbox" class="flex flex-col w-full">
                            <Slot />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});
