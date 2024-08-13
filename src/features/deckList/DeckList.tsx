import { component$ }              from "@builder.io/qwik";
import { DeckCard }                from "~/components/deckCard";
import { useListPublicDeckLoader } from "~/providers/loaders/decks";

export const DeckList = component$(() => {
  const decks = useListPublicDeckLoader();

  return (
    <div class="flex p-2 flex-wrap gap-[0.5rem]">
      {decks.value.decks.map(d => {
        return (
          <DeckCard id={d.id} name={d.name} splashArt={d.splashArt} key={d.id}/>
        );
      })}
    </div>
  )
});
