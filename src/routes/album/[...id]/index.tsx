import { component$, useContextProvider } from "@builder.io/qwik";
import { routeLoader$ }                   from "@builder.io/qwik-city";

import { TOKENS }    from "~/app/shared/binds/TOKENS";
import { EditAlbum } from "~/features/albums/EditAlbum";
import { IoC }       from "~/lib/IoC";

import type { AlbumViewStoreState }              from "~/UI/album/models/album.model";
import { ALBUM_VIEW_CONTEXT, useAlbumViewStore } from "~/UI/album/store/albumView.store";

export const useAlbumViewLoader = routeLoader$<AlbumViewStoreState>(async ({ params, redirect }) => {
    const albumId = params.id;

    if (!albumId) {
        throw redirect(304, '/album')
    }

    let album: AlbumViewStoreState;

    try {
        const getAlbum = IoC.instance.resolve(TOKENS.GET_ALBUM_VIEW_STATE_PRESENTER)

        album = await getAlbum.execute(parseInt(albumId));
    } catch (err) {
        throw redirect(302, '/album');
    }

    return album;
})

export default component$(() => {

    const albumViewState = useAlbumViewLoader();

    const albumViewStore = useAlbumViewStore(albumViewState.value)

    useContextProvider(ALBUM_VIEW_CONTEXT, albumViewStore);

    return (
            <EditAlbum/>
    );
});
