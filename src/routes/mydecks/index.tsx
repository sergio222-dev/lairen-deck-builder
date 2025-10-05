import { component$, useContextProvider } from "@builder.io/qwik";
import { Link, routeLoader$ }             from "@builder.io/qwik-city";
import { listUserDecks }      from "~/app/deck/application/listUserDecks";
import { DeckRepository }     from "~/app/deck/infrastructure/deck.repository";
import { Button }             from "~/components/button";
import { MyDecks }            from "~/features/myDecks/MyDecks";
import { Logger }             from "~/lib/logger";
import { createClientServer } from "~/lib/supabase-qwik";
import type { DeckListStoreState }             from "~/UI/deck/models/deck.store.model";
import { DECK_LIST_CONTEXT, useDeckListStore } from "~/UI/deck/store/decksList.store";

export const useMyDecksLoader = routeLoader$<DeckListStoreState>(async function (request) {
    const supabase = createClientServer(request);

    const { data: auth, error } = await supabase.auth.getUser();

    if (error) {
        Logger.error(error);
    }

    if (!auth.user?.id) {
        Logger.error(`User not authorized in ${useMyDecksLoader.name}`);
        throw request.redirect(302, '/');
    }

    const deckRepo = new DeckRepository(request);

    const decks = await listUserDecks(deckRepo, auth.user.id)

    return {
        decks: decks.map(d => ({
            deckId: d.id,
            name: d.name,
            description: d.description,
            splashArt: d.splashArt,
            isPublic: d.isPublic,
            type1: d.type1,
            type2: d.type2,
        }))
    }

})

export default component$(() => {
    const deckListState = useMyDecksLoader();

    const deckListStoreState = useDeckListStore(deckListState);

    useContextProvider(DECK_LIST_CONTEXT, deckListStoreState);

    return (
            <div class="overflow-y-auto w-full">
                <div class="flex w-full justify-between py-4 px-2">
                    <h1 class="text-2xl font-bold">My Decks</h1>
                    <Link href="/decks/create/">
                        <Button>Create Deck</Button>
                    </Link>
                </div>
                <MyDecks/>
            </div>
    )
});
