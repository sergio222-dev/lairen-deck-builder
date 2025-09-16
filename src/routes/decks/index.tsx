import { component$, useContext } from '@builder.io/qwik';
import { Link, routeLoader$ }     from '@builder.io/qwik-city';
import { listPublicDecks }        from "~/app/deck/application/listPublicDecks";
import { Button }                 from "~/components/button";
import { DeckList }               from "~/features/deckList";
import type { PublicDeckItem }    from "~/models/Deck";
import { DeckRepository }         from "~/providers/repositories/DeckRepository";
import { UserContext }            from "~/routes/layout";

// SERVER ACTIONS
export const useListPublicDeckLoader = routeLoader$<PublicDeckItem[]>(async (requestEnv) => {
    const deckRepo = new DeckRepository(requestEnv);
    return await listPublicDecks(deckRepo);
});

// RENDER
export default component$(() => {
    const user = useContext(UserContext);

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
