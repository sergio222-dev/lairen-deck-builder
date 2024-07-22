import { component$, useComputed$, useContext, useStylesScoped$ } from '@builder.io/qwik';
import type { Card }                                              from '~/models/Card';
import { DeckCreationContext }                                    from '~/stores/deckCreationContext';

interface CardDeckProps {
  card: Card;
}

export const CardDeck = component$<CardDeckProps>(({ card }) => {
  const d = useContext(DeckCreationContext);

  const deckData = d.deckData;

  const deckQuantity = useComputed$(() => {
    const masterDeckQuantity = Object.entries(deckData.masterDeck).map(([, c]) => c).find(c => c.id === card.id)?.quantity ?? 0;
    const treasureDeckQuantity = Object.entries(deckData.treasureDeck).map(([, c]) => c).find(c => c.id === card.id)?.quantity ?? 0;
    return masterDeckQuantity + treasureDeckQuantity;
  });

  const sideQuantity = useComputed$(() => {
    return Object.entries(deckData.sideDeck).map(([, c]) => c).find(c => c.id === card.id)?.quantity ?? 0;
  });

  useStylesScoped$(`
  .card-text-shadow {
    text-shadow: -1px 1px 0 #FFF, 1px 1px 0 #FFF, 1px -1px 0 #FFF;
   }
  `);


  return (
    <div
      class="md:w-[calc(33%-1.5rem)] lg:w-[calc(33%-1.5rem)] xl:w-[calc(20%-1.5rem)] 2xl:w-[calc(16.33%-1.5rem)] w-full transition-all hover:bg-[length:100%_auto] hover:ring-4 ring-2 h-[80px] bg-no-repeat bg-[length:120%_auto] bg-[50%_25%] relative"
      key={card.id}
      style={{
        backgroundImage: `url(${card.image})`
      }}
    >
      <div
        class="absolute bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_40%,rgba(0,0,0,0.8)_60%,rgba(0,0,0,0)_100%)] w-full h-full"/>
      {/*<div class="absolute w-full h-full" />*/}
      <div class="flex-[5] grid grid-cols-[minmax(40px,_1fr)_4fr_minMax(40px,_1fr)] h-full relative ">

        <div
          class="absolute text-white bottom-[-12px] left-[40px] bg-pink-800 px-2 rounded-[50%] border-2 border-black"
          style={sideQuantity.value === 0 ? { backgroundColor: 'gray' } : {}}
        >
          <span>{sideQuantity.value}</span>
        </div>

        <div
          class="absolute text-white bottom-[-12px] right-[40px] bg-orange-600 px-2 rounded-[50%] border-2 border-black"
          style={deckQuantity.value === 0 ? { backgroundColor: 'gray' } : {}}
        >
          <span>{deckQuantity.value}</span>
        </div>

        <div class="flex flex-col gap-1 p-[4px]">
          <div
            class="flex select-none items-center bg-pink-800 flex-1 w-full border-2 border-black rounded justify-center hover:cursor-pointer"
            style={sideQuantity.value === 0 ? { backgroundColor: 'gray' } : {}}
            onClick$={() => d.addCard(card, true)}
          >
            +
          </div>
          <div
            class="bg-pink-800 select-none flex-1 w-full border-2 border-black rounded flex justify-center items-center hover:cursor-pointer"
            style={sideQuantity.value === 0 ? { backgroundColor: 'gray' } : {}}
            onClick$={() => d.removeCard(card, true)}
          >
            -
          </div>
        </div>
        <p
          class="flex-[4] px-[24px]  self-center text-center break-words text-[10px] text-white font-semibold">{card.name}</p>
        <div class="flex flex-col gap-1 p-[4px]">
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
    </div>
  );
});
