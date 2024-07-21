import { component$, useComputed$, useContext } from '@builder.io/qwik';
import type { DeckCard }                        from '~/models/Deck';
import { DeckCreationContext }    from "~/stores/deckCreationContext";

interface CardDeckControlProps {
  card: DeckCard;
}

export const CardDeckControl = component$<CardDeckControlProps>(({ card }) => {
  const d = useContext(DeckCreationContext);

  const deckData = d.deckData;

  const deckQuantity = useComputed$(() => {
    const masterDeckQuantity = Object.entries(deckData.masterDeck).map(([, c]) => c).find(c => c.id === card.id)?.quantity ?? 0;
    const treasureDeckQuantity = Object.entries(deckData.treasureDeck).map(([, c]) => c).find(c => c.id === card.id)?.quantity ?? 0;
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

      <div class="flex flex-row-reverse gap-1 p-[4px]">
        <div
          class="flex select-none items-center bg-orange-600 flex-1 w-full border-2 border-black rounded justify-center hover:cursor-pointer"
          style={deckQuantity.value === 0 ? { backgroundColor: 'gray' } : {}}
          onClick$={() => d.addCard(card, false)}
        >
          +
        </div>
        <div
          class="bg-orange-600 select-none flex-1  w-full border-2 border-black rounded flex justify-center items-center hover:cursor-pointer"
          style={deckQuantity.value === 0 ? { backgroundColor: 'gray' } : {}}
          onClick$={() => d.removeCard(card, false)}
        >
          -
        </div>
      </div>
    </div>
  )
});
