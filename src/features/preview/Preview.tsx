import { component$, useComputed$ }      from "@builder.io/qwik";
import { Button }                        from "~/components/button";
import { Icon }                          from "~/components/icons/Icon";
import { CardDeckInfoPreview }           from "~/features/preview/components/CardDeckInfoPreview";
import { usePublicDeckLoader }           from "~/providers/loaders/decks";
import { costCalculator, getColorLever } from "~/utils/costCalculator";
import { parseToText }                   from "~/utils/parser";

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
        <div class="flex gap-2 items-center">
          <h1 class="text-3xl">
            {deck.value?.name}
          </h1>
          <Button class="active:ring-2 ring-red-600"
                  onClick$={() => deck.value && navigator.clipboard.writeText(parseToText(deck.value))}>
            <Icon name="copy" width={24} height={24} class="fill-primary"/>
          </Button>
        </div>
        <p>Presupuesto: <span style={{ color: colorLevelDeck.value }}> {costLevelDeck.value}</span></p>
      </div>

      {deck.value && <CardDeckInfoPreview deck={deck.value}/>}
    </div>
  )
});
