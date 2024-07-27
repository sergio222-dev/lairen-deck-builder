import { component$, useComputed$, useSignal } from '@builder.io/qwik';
import { PopoverCard }                         from "~/components/popoverCard/PopoverCard";
import type { DeckCard, DeckState }            from '~/models/Deck';

interface CardDeckControlProps {
  card: DeckCard;
  deck: DeckState;
  isSide?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export const CardDeckControlPreview = component$<CardDeckControlProps>(({ card, deck, orientation = 'vertical', isSide = false }) => {
  const showPreview = useSignal(false);
  const previewRef = useSignal<HTMLDivElement>();

  const deckQuantity = useComputed$(() => {
    const masterDeckQuantity   = Object.entries(deck.masterDeck)
      .map(([, v]) => v)
      .filter(c => c.id === card.id)
      .reduce((acc, c) => acc + c.quantity, 0);
    const treasureDeckQuantity = Object.entries(deck.treasureDeck)
      .map(([, v]) => v)
      .filter(c => c.id === card.id)
      .reduce((acc, c) => acc + c.quantity, 0);
    const sideDeckQuantity     = Object.entries(deck.sideDeck)
      .map(([, v]) => v)
      .filter(c => c.id === card.id)
      .reduce((acc, c) => acc + c.quantity, 0);
    return isSide ? sideDeckQuantity : masterDeckQuantity + treasureDeckQuantity;
  });

  return (
    <div
      class={`aspect-[3/4] ${orientation === 'horizontal' ?
        'md:w-[12.5%] sm:w-[25%] w-1/4 lg:w-[10%] xl:w-[8%] 2xl:w-[6%]' :
        'md:w-[25%] sm:w-[25%] w-1/4 lg:w-[20%] xl:w-[16%] 2xl:w-[16.6%]'} bg-no-repeat bg-[length:100%_100%] relative flex flex-col`}
      style={{
        backgroundImage: `url(${card.image})`
      }}
      onMouseEnter$={() => showPreview.value = true}
      onMouseLeave$={() => showPreview.value = false}
      onMouseMove$={(e: MouseEvent) => {
        if (!previewRef.value) return;
        // check if mouse bellow the half of the screen
        if (e.clientY > window.innerHeight / 2) {
          previewRef.value.style.top = `${e.clientY - 24 - ((400*4) / 3)}px`;
        } else {
          previewRef.value.style.top = `${e.clientY - 24}px`;
        }

        // check if mouse after the half of the screen horizontally
        if (e.clientX > window.innerWidth / 2) {
          previewRef.value.style.left = `${e.clientX - 24 - 400}px`;
        } else {
          previewRef.value.style.left = `${e.clientX + 24}px`;
        }
      }}
    >
      <PopoverCard show={showPreview.value} image={card.image} ref={previewRef} />
      <div
        class={`absolute scale-125 text-white top-[5%] left-[5%] ${isSide ? 'bg-pink-800' : ' bg-orange-600'} px-2 rounded-[50%] border-2 border-black`}
        style={deckQuantity.value === 0 ? { backgroundColor: 'gray' } : {}}
      >
        <span>{deckQuantity.value}</span>
      </div>

      <div class="flex flex-1">

      </div>
    </div>
  )
});
