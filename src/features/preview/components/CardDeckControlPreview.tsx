import { component$, useComputed$, useContext } from '@builder.io/qwik';
import type { DeckCard, DeckState }             from '~/models/Deck';
import { CardViewerContext }                    from "~/stores/cardViewerContext";

interface CardDeckControlProps {
  card: DeckCard;
  deck: DeckState;
  isSide?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export const CardDeckControlPreview = component$<CardDeckControlProps>((
  {
    card,
    deck,
    orientation = 'vertical',
    isSide = false
  }
) => {
  const cardViewer = useContext(CardViewerContext);

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
      class={`aspect-[2.5/3.5] rounded-[5%/3.571428571428571%] ${orientation === 'horizontal' ?
        'md:w-[25%] sm:w-[33%] w-1/2 lg:w-[16.6%] xl:w-[12.5%] 2xl:w-[10%]' :
        'md:w-[50%] sm:w-[33%] w-1/2 lg:w-[33%] xl:w-[25%] 2xl:w-[20%]'} bg-no-repeat bg-[length:100%_100%] relative flex flex-col`}
      style={{
        backgroundImage: `url(${card.image})`
      }}
    >
      <div
        class={`absolute scale-125 text-white top-[5%] left-[5%] ${isSide ?
          'bg-pink-800' :
          ' bg-orange-600'} px-2 rounded-[50%] border-2 border-black`}
        style={deckQuantity.value === 0 ? { backgroundColor: 'gray' } : {}}
      >
        <span>{deckQuantity.value}</span>
      </div>

      <div class="flex flex-1" onClick$={() => {
        void cardViewer.setCard(card);
        cardViewer.isOpen = true;
      }}>

      </div>
    </div>
  )
});
