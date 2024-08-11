import { component$, useComputed$ }      from "@builder.io/qwik";
import { CardDeckInfoPreview }           from "~/features/preview/components/CardDeckInfoPreview";
import { usePublicDeckLoader }           from "~/providers/loaders/decks";
import { costCalculator, getColorLever } from "~/utils/costCalculator";

export const PreviewDeck = component$(() => {
  const deck = usePublicDeckLoader();

  const costLevelDeck = useComputed$(() => {
    const allCards = {
      ...deck.value?.masterDeck,
      ...deck.value?.treasureDeck,
      ...deck.value?.sideDeck
    };

    return costCalculator(allCards);
  })

  const colorLevelDeck = useComputed$(() => {
    return getColorLever(costLevelDeck.value);
  });

  return (
    <div>
      {!deck.value && <div>Loading...</div>}
      <div class="flex flex-col items-center justify-center">
        <h1 class="text-3xl">{deck.value?.name}</h1>
        <p>Presupuesto: <span style={{ color: colorLevelDeck.value }}> {costLevelDeck.value}</span></p>
      </div>

      {deck.value && <CardDeckInfoPreview deck={deck.value}/>}
    </div>
  )
});
