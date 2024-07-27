import { component$, useComputed$, useContext, useSignal } from '@builder.io/qwik';
import { Icon }                                            from "~/components/icons/Icon";
import { PopoverCard }                                     from "~/components/popoverCard/PopoverCard";
import type { DeckCard }                                   from '~/models/Deck';
import { DeckCreationContext }                             from "~/stores/deckCreationContext";

interface CardDeckControlProps {
  card: DeckCard;
  isSide?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export const CardDeckControl = component$<CardDeckControlProps>(({ card, orientation, isSide }) => {
  const d = useContext(DeckCreationContext);

  const showPreview = useSignal(false);
  const previewRef  = useSignal<HTMLDivElement>();

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
        'md:w-[12.5%] sm:w-[25%] w-1/4 lg:w-[10%] xl:w-[8%] 2xl:w-[6%]' :
        'md:w-[25%] sm:w-[25%] w-1/4 lg:w-[20%] xl:w-[16%] 2xl:w-[16.6%]'} bg-no-repeat bg-[length:100%_100%] relative flex flex-col`}
      style={{
        backgroundImage: `url(${card.image})`
      }}
    >
      <PopoverCard show={showPreview.value} image={card.image} ref={previewRef} />

      <div
        class={`absolute text-white select-none top-[5%] left-[5%] ${isSide ?
          'bg-pink-800' :
          ' bg-orange-600'} px-2 rounded-[50%] border-2 border-black`}
        style={deckQuantity.value === 0 ? { backgroundColor: 'gray' } : {}}
      >
        <span>{deckQuantity.value}</span>
      </div>

      <div class="top-[5%] cursor-pointer inline right-[5%] select-none text-white absolute bg-orange-600 rounded-[50%] border-2 border-black p-1">
        <Icon name="art" width={16} fill="white"/>
      </div>

      <div
        class="flex flex-1 select-none"
        onMouseEnter$={() => showPreview.value = true}
        onMouseLeave$={() => showPreview.value = false}
        onMouseMove$={(e: MouseEvent) => {
          if (!previewRef.value) return;
          // check if mouse bellow the half of the screen
          if (e.clientY > window.innerHeight / 2) {
            previewRef.value.style.top = `${e.clientY - 24 - ((400 * 4) / 3)}px`;
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
      </div>

      <div class="flex h-[32px] justify-around flex-row-reverse gap-1 p-[4px]">
        <div
          class={`flex select-none items-center ${isSide ?
            'bg-pink-800' :
            ' bg-orange-600'} w-[32px] border-2 border-black rounded justify-center hover:cursor-pointer`}
          style={deckQuantity.value === 0 ? { backgroundColor: 'gray' } : {}}
          onClick$={() => d.addCard(card, isSide)}
        >
          +
        </div>
        <div
          class={`${isSide ?
            'bg-pink-800' :
            ' bg-orange-600'} select-none w-[32px] border-2 border-black rounded flex justify-center items-center hover:cursor-pointer`}
          style={deckQuantity.value === 0 ? { backgroundColor: 'gray' } : {}}
          onClick$={() => d.removeCard(card, isSide)}
        >
          -
        </div>
      </div>
    </div>
  )
});
