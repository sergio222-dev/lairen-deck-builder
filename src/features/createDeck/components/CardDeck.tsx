import { component$, useContext, useSignal, useStylesScoped$ } from '@builder.io/qwik';
import {
  PopoverCard
}                                                              from "~/components/popoverCard/PopoverCard";
import { useDeckQuantity }                                     from "~/hooks/useDeckQuantity";
import type { Card }                                           from '~/models/Card';
import {
  DeckCreationContext
}                                                              from '~/stores/deckCreationContext';

interface CardDeckProps {
  card: Card;
}

export const CardDeck = component$<CardDeckProps>(({ card }) => {
  const d = useContext(DeckCreationContext);

  const deckData = d.deckData;

  const showPreview = useSignal(false);
  const previewRef  = useSignal<HTMLDivElement>();

  const [deckQuantity] = useDeckQuantity(deckData, card.id);

  const [sideQuantity] = useDeckQuantity(deckData, card.id, true);

  useStylesScoped$(`
  .card-text-shadow {
    text-shadow: -1px 1px 0 #FFF, 1px 1px 0 #FFF, 1px -1px 0 #FFF;
   }
  `);

  return (
    <div class="w-[calc(50%-0.5rem)] md:w-[calc(50%-0.5rem)] lg:w-[calc(50%-0.5rem)] xl:w-[calc(33%-0.5rem)] 2xl:w-[calc(33%-0.5rem)]">

      <div
        class={`
       transition-all hover:bg-[length:100%_auto] hover:ring-4
      ring-2 aspect-[3/4] bg-no-repeat bg-[length:100%_auto] bg-[50%_25%] relative`}
        key={card.id}
        style={{
          backgroundImage: `url(${card.image})`
        }}

      >
        <PopoverCard show={showPreview.value} image={card.image} ref={previewRef}/>
        {/*<div*/}
        {/*  class="absolute bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_40%,rgba(0,0,0,0.8)_60%,rgba(0,0,0,0)_100%)] w-full h-full"/>*/}

      </div>

      <div class="flex justify-between overflow-x-auto"
      >
        <div class="flex gap-1 p-[4px] items-center">
          <div
            class="bg-pink-800 select-none w-[calc(1rem+1vw)] h-[calc(1rem+1vw)] border-2 border-black rounded flex justify-center items-center hover:cursor-pointer"
            style={sideQuantity.value === 0 ? { backgroundColor: 'gray' } : {}}
            onClick$={() => d.removeCard(card, true)}
          >
            -
          </div>
          <div
            class="text-white w-[calc(1rem+1vw)] h-[calc(1rem+1vw)] flex items-center justify-center bg-pink-800 px-2 rounded-[50%] border-2 border-black"
            style={sideQuantity.value === 0 ? { backgroundColor: 'gray' } : {}}
          >
            <span>{sideQuantity.value}</span>
          </div>
          <div
            class="flex select-none items-center bg-pink-800 w-[calc(1rem+1vw)] h-[calc(1rem+1vw)] border-2 border-black rounded justify-center hover:cursor-pointer"
            style={sideQuantity.value === 0 ? { backgroundColor: 'gray' } : {}}
            onClick$={() => d.addCard(card, true)}
          >
            +
          </div>
        </div>
        {/*<div*/}
        {/*  class="sm:flex hidden align-center"*/}
        {/*  onMouseEnter$={() => showPreview.value = true}*/}
        {/*  onMouseLeave$={() => showPreview.value = false}*/}
        {/*  onMouseMove$={(e: MouseEvent) => {*/}
        {/*    if (!previewRef.value) return;*/}
        {/*    // check if mouse bellow the half of the screen*/}
        {/*    if (e.clientY > window.innerHeight / 2) {*/}
        {/*      previewRef.value.style.top = `${e.clientY - 24 - ((400 * 4) / 3)}px`;*/}
        {/*    } else {*/}
        {/*      previewRef.value.style.top = `${e.clientY - 24}px`;*/}
        {/*    }*/}

        {/*    // check if mouse after the half of the screen horizontally*/}
        {/*    if (e.clientX > window.innerWidth / 2) {*/}
        {/*      previewRef.value.style.left = `${e.clientX - 24 - 400}px`;*/}
        {/*    } else {*/}
        {/*      previewRef.value.style.left = `${e.clientX + 24}px`;*/}
        {/*    }*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <p*/}
        {/*    class="flex-[4] px-[24px] select-none self-center text-center break-words text-[10px] text-white font-semibold"*/}
        {/*  >*/}
        {/*    {card.name}*/}
        {/*  </p>*/}
        {/*</div>*/}
        <div class="flex gap-1 p-[4px]">
          <div
            class="bg-orange-600 select-none w-[calc(1rem+1vw)] h-[calc(1rem+1vw)] border-2 border-black rounded flex justify-center items-center hover:cursor-pointer"
            style={deckQuantity.value === 0 ? { backgroundColor: 'gray' } : {}}
            onClick$={() => d.removeCard(card, false)}
          >
            -
          </div>
          <div
            class="text-white w-[calc(1rem+1vw)] h-[calc(1rem+1vw)] flex items-center justify-center bg-orange-600 px-2 rounded-[50%] border-2 border-black"
            style={deckQuantity.value === 0 ? { backgroundColor: 'gray' } : {}}
          >
            <span>{deckQuantity.value}</span>
          </div>
          <div
            class="flex select-none items-center bg-orange-600 w-[calc(1rem+1vw)] h-[calc(1rem+1vw)] border-2 border-black rounded justify-center hover:cursor-pointer"
            style={deckQuantity.value === 0 ? { backgroundColor: 'gray' } : {}}
            onClick$={() => d.addCard(card, false)}
          >
            +
          </div>
        </div>
      </div>
    </div>
  );
});
