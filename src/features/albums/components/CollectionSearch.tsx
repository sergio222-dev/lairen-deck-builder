import { $, component$, useContext } from "@builder.io/qwik";
import { ALBUM_VIEW_CONTEXT }        from "~/UI/album/store/albumView.store";
import { useDebounce }               from "~/utils/useDebounce";

export const CollectionSearch = component$(() => {
    const a = useContext(ALBUM_VIEW_CONTEXT);

    const onDebounce = useDebounce(800, $(async (value: string) => {
        void a.applyFilter(value);
    }))

    return (
            <div class="relative my-4 items-center w-full rounded-3xl px-4 py-2 min-h-[40px] ring-primary ring-4 focus-within:ring-secondary flex gap-2 flex-wrap">
                <input
                        name="contains"
                        autoComplete="off"
                        class="focus:outline-none bg-transparent flex-1 w-full"
                        type="text"
                        placeholder="Type to search..."
                        onKeyUp$={a => onDebounce((a.target as HTMLInputElement).value)}
                        tabIndex={1}
                />
            </div>
    )
})
