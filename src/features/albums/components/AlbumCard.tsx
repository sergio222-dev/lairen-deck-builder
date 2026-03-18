import { $, component$, useContext } from "@builder.io/qwik";
import { Link, useNavigate }         from "@builder.io/qwik-city";
import { AppContext }                from "~/stores/appContext";
import { ALBUM_LIST_CONTEXT }        from "~/UI/album/store/albumList.store";

interface AlbumCardProps {
    name: string;
    current: number;
    total: number;
    id: number;
}

export const AlbumCard = component$<AlbumCardProps>(({ name, current, total, id }) => {
    const app = useContext(AppContext);
    const a   = useContext(ALBUM_LIST_CONTEXT);

    const ratio = (current / total) * 100;
    const nav   = useNavigate();

    const deleteAlbum = $(async () => {
        if (!app.dialogYesNo?.value) return;
        const response = await app.dialogYesNo?.value?.open('Estas seguro de que quieres borrar este Album?');

        if (response) {
            await a.deleteAlbum(id)
        }
    });

    return (
            <Link href={`/album/${id}`}
                  class="rounded cursor-pointer flex flex-col gap-2 p-2 min-h-[50px] border-primary border-2 hover:border-secondary text-white">
                <div class="flex gap-2 justify-between">
                    <h2 class="self-start">{name}</h2>
                    <button stoppropagation:click onClick$={() => deleteAlbum()}
                            class="bg-secondary text-black rounded px-4 disabled:bg-gray-400">Delete
                    </button>
                </div>
                <div>
                    <div><span>{current} / {total}</span></div>
                    <div class="rounded-2xl bg-white overflow-hidden">
                        <div class="h-[18px] bg-secondary rounded-2xl" style={{ width: `${ratio}%` }}></div>
                    </div>
                </div>
            </Link>
    );
})
