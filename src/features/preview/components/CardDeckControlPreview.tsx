import { component$, useContext } from '@builder.io/qwik';
import { CardViewerContext }      from "~/stores/cardViewerContext";
import { DECK_PREVIEW_CONTEXT }   from "~/UI/deck/store/deckPreview.store";

interface CardDeckControlProps {
    cardId: number;
    isSide?: boolean;
    orientation?: 'horizontal' | 'vertical';
}

export const CardDeckControlPreview = component$<CardDeckControlProps>((
        {
            cardId,
            orientation = 'vertical',
            isSide = false
        }
) => {
    const deck       = useContext(DECK_PREVIEW_CONTEXT);
    const cardViewer = useContext(CardViewerContext);

    const cardData   = deck.cardStack[cardId];
    const cardInDeck = deck.cardInDeck[cardId];

    return (
            <div
                    class={`aspect-[2.5/3.5] rounded-[5%/3.571428571428571%] ${orientation === 'horizontal' ?
                            'md:w-[25%] sm:w-[33%] w-1/2 lg:w-[16.6%] xl:w-[12.5%] 2xl:w-[10%]' :
                            'md:w-[50%] sm:w-[33%] w-1/2 lg:w-[33%] xl:w-[25%] 2xl:w-[20%]'} bg-no-repeat bg-[length:100%_100%] relative flex flex-col`}
                    style={{
                        backgroundImage: `url(${cardData.image})`
                    }}
                    onClick$={() => {
                        void cardViewer.setCard(cardData);
                        cardViewer.isOpen = true;
                    }}
            >
                <div class="absolute text-white select-none  w-full h-full flex justify-center items-center">
                    <div class="relative">
                    </div>
                    <span class="text-[4vh] font-bold p-4 bg-[#00000090]">x{isSide ?
                            cardInDeck.quantityInSide :
                            cardInDeck.quantity}</span>
                </div>
            </div>
    )
});
