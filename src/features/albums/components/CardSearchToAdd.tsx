import { $, component$, useContext, useOnDocument, useSignal } from "@builder.io/qwik";
import { AppContext }                                          from "~/stores/appContext";
import { ALBUM_VIEW_CONTEXT }                                  from "~/UI/album/store/albumView.store";
import { useDebounce }                          from "~/utils/useDebounce";

export const CardSearchToAdd = component$(() => {
    const a = useContext(ALBUM_VIEW_CONTEXT);
    const app = useContext(AppContext);

    const resultsRefs = useSignal<HTMLSelectElement>()
    const inputRef = useSignal<HTMLInputElement>();

    const onDebounce = useDebounce(800, $(async (value: string) => {
        if (value === '' || value.length < 3)
            if (resultsRefs.value) {
                a.resultCards                    = {};
                resultsRefs.value.dataset.isOpen = 'false';
                return;
            }
        app.isLoading = true;
        await a.queryCards(value);
        app.isLoading = false;
        if (resultsRefs.value)
            resultsRefs.value.dataset.isOpen = 'true';
    }))

    useOnDocument('click', $((e) => {
        if (!resultsRefs.value) return;
        if (resultsRefs.value.dataset.isOpen === 'false') return;

        const isInside = resultsRefs.value.contains((e.target as Node));
        if (!isInside) {
            resultsRefs.value.dataset.isOpen = 'false';
        }
    }));

    const results = Object.keys(a.resultCards);

    return (
            <div class="relative my-4 items-center w-full rounded-3xl px-4 py-2 min-h-[40px] ring-primary ring-4 focus-within:ring-secondary flex gap-2 flex-wrap">
                <input
                        ref={inputRef}
                        name="contains"
                        autoComplete="off"
                        class="focus:outline-none bg-transparent flex-1 w-full"
                        type="text"
                        placeholder="Type to add..."
                        onKeyUp$={a => onDebounce((a.target as HTMLInputElement).value)}
                        tabIndex={1}
                />

                <select ref={resultsRefs} data-is-open="false" id="results" tabIndex={1}
                        size={Math.max(2, Math.min(10, results.length))}
                        hidden={results.length === 0}
                        class="absolute py-1 px-2 max-h-[50vh] top-[100%] w-[calc(100%_-_2rem)] bg-white text-black overflow-y-auto z-10">
                    {results.length > 0 && Object.values(a.resultCards).map((c => (
                            <option onClick$={async () => {
                                app.isLoading = true;
                                await a.addCard(c.id)
                                inputRef.value && (inputRef.value.value = "");
                                app.isLoading = false;
                            }}
                                    class="hover:bg-gray-400 hover:cursor-pointer select-none"
                                    key={c.id}>
                                {c.name}
                            </option>
                    )))}
                </select>
            </div>
    )
})
