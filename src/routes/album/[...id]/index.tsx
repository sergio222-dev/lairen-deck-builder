import { component$, useContextProvider }        from "@builder.io/qwik";
import { routeLoader$ }                          from "@builder.io/qwik-city";
import { TOKENS }                                from "~/app/shared/binds/TOKENS";
import { IdValueObject }                         from "~/app/shared/models/VO/Id.ValueObject";
import { EditAlbum }                             from "~/features/albums/EditAlbum";
import { IoC }                                   from "~/lib/IoC";
import type { AlbumViewStoreState, UIAlbumCard } from "~/UI/album/models/album.model";
import { ALBUM_VIEW_CONTEXT, useAlbumViewStore } from "~/UI/album/store/albumView.store";
import { normalizeData }                         from "~/utils/normalize";

export const useAlbumViewLoader = routeLoader$<AlbumViewStoreState>(async ({ params, redirect }) => {
    const albumId = params.id;

    if (!albumId) {
        throw redirect(304, '/album')
    }

    const getAlbum = IoC.instance.resolve(TOKENS.GET_ALBUM)

    const a = await getAlbum.execute(new IdValueObject(parseInt(albumId)))

    const tags = a.tags.map(t => t.name.value);
    const cards: UIAlbumCard[] = a.cards.map(c => {
        return {
            id:   c.id.value,
            name: c.name.value,
            image: c.image.value,
            tags: a.tags.map(t => {
                const name = t.name.value;
                const tt = c.tags.find(tt => tt.id.equals(t.id));
                const quantity = tt ? tt.quantity.value : 0;

                return {
                    name,
                    quantity,
                };
            })
            // tags: c.tags.map(t => ({
            //     name:     t.name.value,
            //     quantity: t.quantity.value,
            // }))
        };
    })

    const nc = normalizeData(cards);

    return {
        resultCards: {},
        id:          a.id.value,
        name:        a.name.value,
        total:       a.total.value,
        current:     a.current.value,
        sets:        a.sets.value,
        cards:       nc,
        tags,
        addedCards:  cards.map(c => c.id),
        editMode: false,
    };
})

export default component$(() => {

    const albumViewState = useAlbumViewLoader();

    const albumViewStore = useAlbumViewStore(albumViewState.value)

    useContextProvider(ALBUM_VIEW_CONTEXT, albumViewStore);

    return (
            <EditAlbum/>
    );
});
