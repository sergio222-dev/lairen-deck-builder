import { component$, useContext } from "@builder.io/qwik";
import { AlbumCard }              from "~/features/albums/components/AlbumCard";
import { ALBUM_LIST_CONTEXT }     from "~/UI/album/store/albumList.store";

export const ListAlbums = component$(() => {

    const a = useContext(ALBUM_LIST_CONTEXT);

    return (
            <div class="overflow-y-auto w-full">
                <div class="grid m-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                    {a.albums.map((album) => (
                            <AlbumCard key={album.id} id={album.id} name={album.name} total={album.total} current={album.current}/>
                    ))}
                </div>
            </div>
    )
});
