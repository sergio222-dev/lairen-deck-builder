import { component$, useContext } from "@builder.io/qwik";
import { DeckCard }               from "~/components/deckCard";
import { DECK_LIST_CONTEXT }      from "~/UI/deck/store/decksList.store";

export const MyDecks = component$(() => {
    const d = useContext(DECK_LIST_CONTEXT);

    return (
            <div class="flex p-2 flex-wrap xl:gap-[2rem] md:gap-4 justify-center">
                {d.decks.map(d => {
                    return (
                            <DeckCard path="/decks/create" id={d.deckId} name={d.name} splashArt={d.splashArt} key={d.deckId}/>
                    );
                })}
            </div>
    )
});
