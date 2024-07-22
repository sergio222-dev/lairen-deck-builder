import { component$ }          from "@builder.io/qwik";
import { CardDeckInfoPreview } from "~/features/preview/components/CardDeckInfoPreview";
import { usePublicDeckLoader } from "~/providers/loaders/decks";

export const PreviewDeck = component$(() => {
  const deck = usePublicDeckLoader();

  return (
    <div>
      {!deck.value && <div>Loading...</div>}
      Deck Name: {deck.value?.name}

      {deck.value && <CardDeckInfoPreview deck={deck.value}/>}
    </div>
  )
});
