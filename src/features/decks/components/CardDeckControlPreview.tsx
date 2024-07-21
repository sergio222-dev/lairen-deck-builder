import { component$, useComputed$ } from '@builder.io/qwik';
import type { DeckCard, DeckState } from '~/models/Deck';

interface CardDeckControlProps {
  card: DeckCard;
  deck: DeckState;
}

export const CardDeckControlPreview = component$<CardDeckControlProps>(({ card, deck }) => {

  const deckQuantity = useComputed$(() => {
    const masterDeckQuantity   = Object.entries(deck.masterDeck)
      .map(([, v]) => v)
      .filter(c => c.id === card.id)
      .reduce((acc, c) => acc + c.quantity, 0);
    const treasureDeckQuantity = Object.entries(deck.treasureDeck)
      .map(([, v]) => v)
      .filter(c => c.id === card.id)
      .reduce((acc, c) => acc + c.quantity, 0);
    return masterDeckQuantity + treasureDeckQuantity;
  });

  return (
    <div
      class="aspect-[3/4] md:w-1/3 sm:w-1/2 lg:w-1/4 xl:w-1/5 2xl:w-1/6 bg-no-repeat bg-[length:100%_100%] relative flex flex-col"
      style={{
        backgroundImage: `url(${card.image})`
      }}
    >
      <div
        class="absolute scale-125 text-white top-[5%] left-[5%] bg-orange-600 px-2 rounded-[50%] border-2 border-black"
        style={deckQuantity.value === 0 ? { backgroundColor: 'gray' } : {}}
      >
        <span>{deckQuantity.value}</span>
      </div>

      <div class="flex flex-1">

      </div>
    </div>
  )
});
