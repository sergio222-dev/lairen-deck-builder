import { component$, useContext } from "@builder.io/qwik";
import { DeckCard }               from "~/components/deckCard";
import { DECK_LIST_CONTEXT }      from "~/UI/deck/store/decksList.store";

export const DeckList = component$(() => {
    const dl = useContext(DECK_LIST_CONTEXT);

  return (
    <div class="flex p-2 flex-wrap gap-[0.5rem]">
      {dl.decks.map(d => {
        return (
          <DeckCard id={d.deckId} name={d.name} splashArt={d.splashArt} key={d.deckId}/>
        );
      })}
    </div>
  )
});
