import { component$ }         from "@builder.io/qwik";
import { DeckCard }              from "~/components/deckCard";
import { useListMyDeckLoader }   from "~/providers/loaders/decks";

export const MyDecks = component$(() => {
  const decks = useListMyDeckLoader();

  return (
    <div class="flex p-2 flex-wrap gap-[0.5rem]">
      {decks.value.decks.map(d => {
        return (
          <DeckCard path="/decks/create" id={d.id} name={d.name} splashArt={d.splashArt} key={d.id}/>
        );
      })}
    </div>
  )
});
