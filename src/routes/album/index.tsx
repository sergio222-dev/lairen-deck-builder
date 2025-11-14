import { $, component$, useContextProvider, useSignal } from "@builder.io/qwik";
import { routeAction$, routeLoader$ }                   from "@builder.io/qwik-city";
import { getAvailableSet }                              from "~/app/card/application/getAvailableSet";

import { TOKENS }                                from "~/app/shared/binds/TOKENS";
import { Button }                                from "~/components/button";
import { CreateAlbum }                           from "~/features/albums/CreateAlbum";
import { ListAlbums }                            from "~/features/albums/ListAlbums";
import { IoC }                                   from "~/lib/IoC";
import type { AlbumListStoreState }              from "~/UI/album/models/album.model";
import { albumCreationValidator }                from "~/UI/album/models/album.model";
import { ALBUM_LIST_CONTEXT, useListAlbumStore } from "~/UI/album/store/albumList.store";

export const useCreateAlbumAction = routeAction$(async (data) => {
    const getCurrentUser = IoC.instance.resolve(TOKENS.GET_CURRENT_USER);
    const createAlbumPresenter = IoC.instance.resolve(TOKENS.CREATE_ALBUM_PRESENTER);

    const user = await getCurrentUser.execute();

    return await createAlbumPresenter.execute({
        name:  data.name,
        tags:  data.tags,
        sets:  data.sets,
        owner: user.id.value,
    })
}, albumCreationValidator);

export const useAlbumLoader = routeLoader$<AlbumListStoreState>(async (req) => {
    const container = IoC.instance

    try {
        const getAlbums      = container.resolve(TOKENS.GET_ALBUMS)
        const getCurrentUser = container.resolve(TOKENS.GET_CURRENT_USER)

        const cardRepository = container.resolve(TOKENS.CARD_REPOSITORY)

        const user   = await getCurrentUser.execute();
        const sets   = await getAvailableSet(cardRepository) // TODO MOVE THIS TO THE CONTAINER
        const albums = await getAlbums.execute(user.id)

        return {
            albums:        albums.map(a => ({
                name:    a.name.value,
                id:      a.id.value,
                total:   a.total.value,
                current: a.current.value
            })),
            availableSets: sets,
        }
    } catch (error) {
        return {
            albums:        [],
            availableSets: [],
        }
    }


})

export default component$(() => {
    const albumState = useAlbumLoader();

    const albumStore = useListAlbumStore(albumState.value);

    useContextProvider(ALBUM_LIST_CONTEXT, albumStore);

    const isOpen  = useSignal(false);
    const onClose = $(() => isOpen.value = false)

    return (
            <div class="overflow-y-auto w-full">
                <div class="flex w-full justify-between py-4 px-2">
                    <h1 class="text-2xl font-bold">My Albums</h1>
                    <Button onClick$={() => isOpen.value = !isOpen.value}>Create Album</Button>
                </div>
                <CreateAlbum onClose={onClose} isOpen={isOpen.value} availableSets={albumState.value.availableSets}/>
                <ListAlbums/>
            </div>
    )
});
