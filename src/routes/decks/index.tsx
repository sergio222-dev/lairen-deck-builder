import { component$, useContext, useContextProvider } from '@builder.io/qwik';
import { Link, routeLoader$ }                         from '@builder.io/qwik-city';
import { listPublicDecks }                            from "~/app/deck/application/listPublicDecks";
import { DeckRepository }                             from "~/app/deck/infrastructure/deck.repository";
import { Button }                                     from "~/components/button";
import { DeckList }                                   from "~/features/deckList";
import { UserContext }                                from "~/routes/layout";
import type { DeckListStoreState }                         from "~/UI/deck/models/deck.store.model";
import { DECK_LIST_CONTEXT, useDeckListStore }        from "~/UI/deck/store/decksList.store";

// SERVER ACTIONS
export const useDeckListStoreLoader = routeLoader$<DeckListStoreState>(async (requestEnv) => {
    const deckRepo    = new DeckRepository(requestEnv);
    const publicDecks = await listPublicDecks(deckRepo);

    return {
        decks: publicDecks.map(d => ({
            deckId: d.id,
            name: d.name,
            description: d.description,
            splashArt: d.splashArt,
            isPublic: true,
        }))
    }
});

// RENDER
export default component$(() => {
    const deckListState = useDeckListStoreLoader();
    const user          = useContext(UserContext);

    const deckListStore = useDeckListStore(deckListState);

    useContextProvider(DECK_LIST_CONTEXT, deckListStore);

    return (
            <div class="overflow-y-auto w-full">
                <div class="flex w-full justify-between py-4 px-2">
                    <h1 class="text-2xl font-bold">Decks List</h1>
                    {user.value && (
                            <Link href="/decks/create/">
                                <Button>Create Deck</Button>
                            </Link>
                    )}
                </div>
                <DeckList/>
            </div>
    )
})
