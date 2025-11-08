import { $, component$, useContext, useOnDocument, useSignal } from "@builder.io/qwik";
import { Button }                                              from "~/components/button";
import { Chip }                                                from "~/components/chip/Chip";
import { Icon }                                                from "~/components/icons/Icon";
import { ALBUM_VIEW_CONTEXT }                                  from "~/UI/album/store/albumView.store";
import { useDebounce }                                         from "~/utils/useDebounce";

import styles from "./styles.module.scss";

export const EditAlbum = component$(() => {
    const a = useContext(ALBUM_VIEW_CONTEXT);

    const resultsRefs = useSignal<HTMLSelectElement>()

    const onDebounce = useDebounce(800, $(async (value: string) => {
        if (value === '' || value.length < 3)
            if (resultsRefs.value) {
                a.resultCards                    = {};
                resultsRefs.value.dataset.isOpen = 'false';
                return;
            }
        await a.queryCards(value);
        if (resultsRefs.value)
            resultsRefs.value.dataset.isOpen = 'true';
    }))

    // this close the selector
    useOnDocument('click', $((e: Event) => {
        if (resultsRefs.value) // Optimization, prevent re renders
            if (resultsRefs.value.dataset.isOpen === 'false') return;
        if (e.target && !document.querySelector('#results')?.contains(e.target as Node)) {
            void a.queryCards('');
            if (resultsRefs.value)
                resultsRefs.value.dataset.isOpen = 'false';
        }
    }))

    const results = Object.keys(a.resultCards);

    return (
            <div class="overflow-y-auto px-6 py-7 w-full">
                <div>
                    <Button>Back to Album</Button>
                </div>

                <div class="relative my-4 items-center w-full rounded-3xl px-4 py-2 min-h-[40px] ring-primary ring-4 focus-within:ring-secondary flex gap-2 flex-wrap">
                    <input
                            name="contains"
                            autocomplete="off"
                            class="focus:outline-none bg-transparent flex-1 w-full"
                            type="text"
                            placeholder="Type to search..."
                            onKeyUp$={a => onDebounce((a.target as HTMLInputElement).value)}
                            tabIndex={1}
                    />

                    <select ref={resultsRefs} data-is-open="false" id="results" tabIndex={1}
                            size={Math.min(10, results.length)}
                            hidden={results.length === 0}
                            class="absolute py-1 px-2 max-h-[50vh] top-[100%] w-[calc(100%_-_2rem)] bg-white text-black overflow-y-auto z-10">
                        {results.length > 0 && Object.values(a.resultCards).map((c => (
                                <option onClick$={() => void a.addCard(c.id)}
                                        class="hover:bg-gray-400 hover:cursor-pointer select-none"
                                        key={c.id}>
                                    {c.name}
                                </option>
                        )))}
                    </select>
                </div>

                <div class="flex items-start justify-between mb-4 border-2 rounded-xl p-6 mt-2">
                    <div>
                        <div class="flex gap-2">
                            <h1>{a.name}</h1>
                            <Button class="py-0" onClick$={() => a.editMode = !a.editMode}><Icon
                                    name={a.editMode ? 'up' : 'down'} width={16} height={16}/></Button>
                        </div>
                        <div class="flex gap-2 mt-2">
                            {a.tags.map(tag => (
                                    <Chip key={tag}>{tag}</Chip>
                            ))}
                        </div>
                    </div>
                </div>

                <div data-edit={a.editMode ? "true" : "false"} class={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2 ${styles['card-list']}`}>

                    {a.addedCards.map(c => (
                            <div key={c} class="overflow-hidden border-2 flex flex-col">
                                <div class="relative aspect-[3/2] bg-muted"
                                     style={{ background: `url(${a.cards[c].image}) 50% 30% no-repeat` }}>

                                </div>
                                <div class="flex flex-col justify-between flex-1">
                                    <div class="p-4">
                                        <h3 class="font-semibold mb-3 text-sm">{a.cards[c].name}</h3>
                                    </div>
                                    <div>
                                        {a.cards[c].tags.map(tag => (
                                                <div key={tag.name} class="flex justify-between px-2 py-1">
                                                    <p class="flex-1">{tag.name}</p>
                                                    <div class="flex flex-2 gap-2">
                                                        <Button class={`${styles['btn-action']}`}>+</Button>
                                                        <p>{tag.quantity}</p>
                                                        <Button class={`${styles['btn-action']}`}>-</Button>
                                                    </div>
                                                </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                    ))}

                </div>
            </div>
    );
});
