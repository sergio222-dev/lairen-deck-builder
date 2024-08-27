import { component$, useContext } from '@builder.io/qwik';
import { ButtonIcon }             from "~/components/button/ButtonIcon";
import { Icon }                   from "~/components/icons/Icon";
import { useDeckQuantity }        from "~/hooks/useDeckQuantity";
import type { DeckCard }          from '~/models/Deck';
import { CardViewerContext }      from "~/stores/cardViewerContext";
import { DeckCreationContext }    from "~/stores/deckCreationContext";

interface CardDeckControlProps {
  card: DeckCard;
  isSide?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export const CardDeckControl = component$<CardDeckControlProps>(({ card, orientation, isSide }) => {
  const d          = useContext(DeckCreationContext);
  const cardViewer = useContext(CardViewerContext);

  const deckData = d.deckData;

  const [deckQuantity] = useDeckQuantity(deckData, card.id, isSide);

  return (
    <div
      class={`aspect-[2.5/3.5] border-4 overflow-hidden rounded-[5%/3.571428571428571%] bg-cover ${d.deckData.splashArtId === card.id ?
        'border-secondary' :
        'border-[#181A1B]'} ${orientation === 'horizontal' ?
        'md:w-[50%] w-1/2 lg:w-[50%] xl:w-[50%] 2xl:w-[33%] sm:w-[33%]' :
        'md:w-[50%] w-1/2 lg:w-[50%] xl:w-[33%] 2xl:w-[33%]'} bg-no-repeat bg-[length:100%_100%] relative flex flex-col`}
      style={{
        backgroundImage: `url(${card.image})`
      }}
    >
      <div
        class={`absolute text-white select-none top-[5%] left-[5%] ${isSide ?
          'bg-pink-800' :
          ' bg-orange-600'} px-2 rounded-[50%] border-2 border-black`}
        style={deckQuantity.value === 0 ? { backgroundColor: 'gray' } : {}}
      >
        <span>{deckQuantity.value}</span>
      </div>

      <div class="top-[5%] inline right-[5%] absolute">
        <ButtonIcon disabled={d.deckData.splashArt === card.image}
                    onClick$={() => d.setSplashArt(card.image, card.id)}>
          <Icon name="art" width={16} height={16} class="fill-primary"/>
        </ButtonIcon>
      </div>

      <div
        class="flex flex-1 select-none"
        onClick$={() => {
          void cardViewer.setCard(card);
          cardViewer.isOpen = true;
        }}
      >
      </div>

      <div class="flex h-[32px] justify-around flex-row-reverse gap-1 p-[4px]">
        <div
          class={`flex select-none items-center ${isSide ?
            'bg-pink-800' :
            ' bg-orange-600'} w-[calc(32px+2vw)] border-2 border-black rounded justify-center hover:cursor-pointer`}
          style={deckQuantity.value === 0 ? { backgroundColor: 'gray' } : {}}
          onClick$={() => d.addCard(card, isSide)}
        >
          +
        </div>
        <div
          class={`${isSide ?
            'bg-pink-800' :
            ' bg-orange-600'} select-none w-[calc(32px+2vw)] border-2 border-black rounded flex justify-center items-center hover:cursor-pointer`}
          style={deckQuantity.value === 0 ? { backgroundColor: 'gray' } : {}}
          onClick$={() => d.removeCard(card, isSide)}
        >
          -
        </div>
      </div>
    </div>
  )
});
