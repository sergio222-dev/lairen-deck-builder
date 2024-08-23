import { component$, useContext } from '@builder.io/qwik';
import { ButtonIcon }             from "~/components/button/ButtonIcon";
import { Icon }                   from "~/components/icons/Icon";
import { useDeckQuantity }        from "~/hooks/useDeckQuantity";
import type { DeckCard }          from '~/models/Deck';
import { CardViewerContext }      from "~/stores/cardViewerContext";
import { DeckCreationContext }    from "~/stores/deckCreationContext";

interface CardDeckControlProProps {
  card: DeckCard;
  isSide?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export const CardDeckControlPro = component$<CardDeckControlProProps>(({ card, isSide }) => {
  const d          = useContext(DeckCreationContext);
  const cardViewer = useContext(CardViewerContext);

  const deckData = d.deckData;

  const [deckQuantity] = useDeckQuantity(deckData, card.id, isSide);

  return (
    <div
      class={`
      flex justify-between items-center h-[40px] rounded-2xl bg-primary bg-no-repeat bg-[right_20%] bg-[length:70%_1000%]
       ${d.deckData.splashArtId === card.id ?
        'border-secondary' :
        'border-primary'} border-4`}
    >
      <div class="flex flex-1 select-none items-center gap-2 min-w-[0]">
        <div>
          <ButtonIcon disabled={d.deckData.splashArt === card.image}
                      onClick$={() => d.setSplashArt(card.image, card.id)}>
            <Icon name="art" width={12} height={12} class="fill-primary"/>
          </ButtonIcon>
        </div>
        <div
          class="overflow-hidden flex-1"
          onClick$={() => {
            void cardViewer.setCard(card);
            cardViewer.isOpen = true;
          }}
        >
          <h3
            class="text-white text-sm font-bold drop-shadow-lg whitespace-nowrap overflow-hidden overflow-ellipsis">{card.name}</h3>
        </div>
      </div>
      <div class="flex gap-1">
        <div
          class={`${isSide ?
            'bg-pink-800' :
            ' bg-orange-600'} select-none w-[32px] border-2 border-black rounded flex justify-center items-center hover:cursor-pointer`}
          style={deckQuantity.value === 0 ? { backgroundColor: 'gray' } : {}}
          onClick$={() => d.removeCard(card, isSide)}
        >
          -
        </div>
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
          class={`text-white select-none ${isSide ?
            'bg-pink-800' :
            ' bg-orange-600'} px-2 rounded-[50%] border-2 border-black`}
          style={deckQuantity.value === 0 ? { backgroundColor: 'gray' } : {}}
        >
          <span>{deckQuantity.value}</span>
        </div>
      </div>

      {/*<div class="flex h-[32px] justify-around flex-row-reverse gap-1 p-[4px]">*/}
      {/*  <div*/}
      {/*    class={`flex select-none items-center ${isSide ?*/}
      {/*      'bg-pink-800' :*/}
      {/*      ' bg-orange-600'} w-[calc(32px+2vw)] border-2 border-black rounded justify-center hover:cursor-pointer`}*/}
      {/*    style={deckQuantity.value === 0 ? { backgroundColor: 'gray' } : {}}*/}
      {/*    onClick$={() => d.addCard(card, isSide)}*/}
      {/*  >*/}
      {/*    +*/}
      {/*  </div>*/}
      {/*  <div*/}
      {/*    class={`${isSide ?*/}
      {/*      'bg-pink-800' :*/}
      {/*      ' bg-orange-600'} select-none w-[calc(32px+2vw)] border-2 border-black rounded flex justify-center items-center hover:cursor-pointer`}*/}
      {/*    style={deckQuantity.value === 0 ? { backgroundColor: 'gray' } : {}}*/}
      {/*    onClick$={() => d.removeCard(card, isSide)}*/}
      {/*  >*/}
      {/*    -*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  )
});
