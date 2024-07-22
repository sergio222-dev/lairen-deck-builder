import { component$, useComputed$, useContext } from '@builder.io/qwik';
import type { DeckCard }                        from '~/models/Deck';
import { DeckCreationContext }                  from "~/stores/deckCreationContext";

interface CardDeckControlProps {
  card: DeckCard;
  isSide?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export const CardDeckControl = component$<CardDeckControlProps>(({ card, orientation, isSide }) => {
  const d = useContext(DeckCreationContext);

  const deckData = d.deckData;

  const deckQuantity = useComputed$(() => {
    const masterDeckQuantity   = Object.entries(deckData.masterDeck)
      .map(([, c]) => c)
      .find(c => c.id === card.id)?.quantity ?? 0;
    const treasureDeckQuantity = Object.entries(deckData.treasureDeck)
      .map(([, c]) => c)
      .find(c => c.id === card.id)?.quantity ?? 0;
    const sideDeckQuantity     = Object.entries(deckData.sideDeck)
      .map(([, c]) => c)
      .find(c => c.id === card.id)?.quantity ?? 0;

    return isSide ? sideDeckQuantity : masterDeckQuantity + treasureDeckQuantity;
  });


  return (
    <div
      class={`aspect-[3/4] ${orientation === 'horizontal' ?
        'md:w-1/6 w-1/4 lg:w-1/8 xl:w-1/10 2xl:w-1/12' :
        'md:w-1/3 w-1/4 lg:w-1/4 xl:w-1/5 2xl:w-1/6'} bg-no-repeat bg-[length:100%_100%] relative flex flex-col`}
      style={{
        backgroundImage: `url(${card.image})`
      }}
    >
      <div
        class={`absolute scale-125 text-white top-[5%] left-[5%] ${isSide ? 'bg-pink-800' : ' bg-orange-600'} px-2 rounded-[50%] border-2 border-black`}
        style={deckQuantity.value === 0 ? { backgroundColor: 'gray' } : {}}
      >
        <span>{deckQuantity.value}</span>
      </div>

      <div class="flex flex-1">

      </div>

      <div class="flex flex-row-reverse gap-1 p-[4px]">
        <div
          class={`flex select-none items-center ${isSide ? 'bg-pink-800' : ' bg-orange-600'} flex-1 w-full border-2 border-black rounded justify-center hover:cursor-pointer`}
          style={deckQuantity.value === 0 ? { backgroundColor: 'gray' } : {}}
          onClick$={() => d.addCard(card, isSide)}
        >
          +
        </div>
        <div
          class={`${isSide ? 'bg-pink-800' : ' bg-orange-600'} select-none flex-1  w-full border-2 border-black rounded flex justify-center items-center hover:cursor-pointer`}
          style={deckQuantity.value === 0 ? { backgroundColor: 'gray' } : {}}
          onClick$={() => d.removeCard(card, isSide)}
        >
          -
        </div>
      </div>
    </div>
  )
});
