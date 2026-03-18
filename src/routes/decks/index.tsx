import { component$, useContext, useContextProvider } from '@builder.io/qwik';
import { Link, routeLoader$ }                         from '@builder.io/qwik-city';
import { TOKENS }                                     from "~/app/shared/binds/TOKENS";
import { Button }                                     from "~/components/button";
import { DeckList }                                   from "~/features/deckList";
import { IoC }                                        from "~/lib/IoC";
import type { DeckListStoreState }                    from "~/UI/deck/models/deck.store.model";
import { DECK_LIST_CONTEXT, useDeckListStore }        from "~/UI/deck/store/decksList.store";
import { USER_CONTEXT }                               from "~/UI/user/store/user.store";

// SERVER ACTIONS
export const useDeckListStoreLoader = routeLoader$<DeckListStoreState>(async () => {

    const instance = IoC.instance;

    const listPublicDecks = instance.resolve(TOKENS.LIST_PUBLIC_DECK_PRESENTER);

    const decks = await listPublicDecks.execute();

    return {
        decks,
    }
});

// RENDER
export default component$(() => {
    const deckListState = useDeckListStoreLoader();
    const userStore = useContext(USER_CONTEXT)

    const deckListStore = useDeckListStore(deckListState);

    useContextProvider(DECK_LIST_CONTEXT, deckListStore);

    return (
            <div class="overflow-y-auto w-full">
                <div class="flex w-full justify-between py-4 px-2">
                    <h1 class="text-2xl font-bold">Lista de Mazos</h1>
                    {userStore.user && (
                            <Link href="/decks/create/">
                                <Button>Crear Mazo</Button>
                            </Link>
                    )}
                </div>
                <DeckList/>
            </div>
    )
})
