import { $, component$, useContextProvider, useSignal } from "@builder.io/qwik";
import { routeLoader$ }                                 from "@builder.io/qwik-city";
import { getAlbums }                                    from "~/app/album/application/getAlbums";
import { AlbumRepository }                              from "~/app/album/infrastructure/album.repository";
import { getAvailableSet }                              from "~/app/card/application/getAvailableSet";
import { CardRepository }                               from "~/app/card/infrastructure/card.repository";
import { Button }                                       from "~/components/button";
import { CreateAlbum }                                  from "~/features/albums/CreateAlbum";
import { createClientServer }                           from "~/lib/supabase-qwik";
import type { AlbumListStoreState }                     from "~/UI/album/models/album.model";
import { ALBUM_CREATE_CONTEXT, useAlbumCreateStore }    from "~/UI/album/store/albumCreate.store";
import { ALBUM_LIST_CONTEXT, useListAlbumStore }        from "~/UI/album/store/albumList.store";

export const useAlbumLoader = routeLoader$<AlbumListStoreState>(async (req) => {

    const supabase = createClientServer(req);

    const { error, data: userData } = await supabase.auth.getUser();

    if (error) {
        return {
            albums:        [],
            availableSets: [],
        }
    }

    const albumRepository = new AlbumRepository(req)
    const cardRepository  = new CardRepository(req)

    const albums = await getAlbums(albumRepository, userData.user.id)
    const sets   = await getAvailableSet(cardRepository)

    return {
        albums:        albums.map(a => ({ name: a.name.value, id: a.id.value })),
        availableSets: sets,
    }
})

export default component$(() => {
    const albumState = useAlbumLoader();

    const albumStore       = useListAlbumStore(albumState);
    const albumCreateStore = useAlbumCreateStore({
        availableSets: albumStore.availableSets,
        name:          '',
        createdTags:   [],
    });


    useContextProvider(ALBUM_LIST_CONTEXT, albumStore);
    useContextProvider(ALBUM_CREATE_CONTEXT, albumCreateStore);

    const isOpen  = useSignal(false);
    const onClose = $(() => isOpen.value = false)

    return (
            <div class="overflow-y-auto w-full">
                <div class="flex w-full justify-between py-4 px-2">
                    <h1 class="text-2xl font-bold">My Albums</h1>
                    <Button onClick$={() => isOpen.value = !isOpen.value}>Create Album</Button>
                </div>
                <CreateAlbum onClose={onClose} isOpen={isOpen.value}/>
            </div>
    )
});
