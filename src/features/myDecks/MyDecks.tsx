import { component$, useContext } from "@builder.io/qwik";
import { DeckCard }               from "~/components/deckCard";
import { DECK_LIST_CONTEXT }      from "~/UI/deck/store/decksList.store";

export const MyDecks = component$(() => {
    const d = useContext(DECK_LIST_CONTEXT);


    return (
            <div class="grid auto-rows-fr gap-4 grid-cols-[repeat(auto-fill,minmax(350px,1fr))] fade-in-children">
                {d.decks.map(d => {
                    return (
                            <DeckCard type1={d.type1} type2={d.type2} path="/decks/create" id={d.deckId} name={d.name} splashArt={d.splashArt} key={d.deckId}/>
                    );
                })}
            </div>
    )
});
