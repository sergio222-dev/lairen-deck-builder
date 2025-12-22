import { component$, useContextProvider }      from "@builder.io/qwik";
import { Link, routeLoader$ }                  from "@builder.io/qwik-city";
import { TOKENS }                              from "~/app/shared/binds/TOKENS";
import { Button }                              from "~/components/button";
import { MyDecks }                             from "~/features/myDecks/MyDecks";
import { IoC }                                 from "~/lib/IoC";
import type { DeckListStoreState }             from "~/UI/deck/models/deck.store.model";
import { DECK_LIST_CONTEXT, useDeckListStore } from "~/UI/deck/store/decksList.store";

export const useMyDecksLoader = routeLoader$<DeckListStoreState>(async function () {
    const instance = IoC.instance;

    const listUserDecks = instance.resolve(TOKENS.LIST_USER_DECK_PRESENTER);

    const decks = await listUserDecks.execute();

    return {
        decks,
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
