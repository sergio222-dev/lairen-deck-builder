import { component$, useContext } from '@builder.io/qwik';
import { ButtonIcon }             from "~/components/button/ButtonIcon";
import { Icon }                   from "~/components/icons/Icon";
import { CARD_VIEW_CONTEXT }      from "~/UI/card/store/cardViewer.storet";
import { DECK_CREATION_CONTEXT }  from "~/UI/deck/store/deckCreation.store";

interface CardDeckControlProps {
    cardId: number;
    isSide?: boolean;
    orientation?: 'horizontal' | 'vertical';
}

export const CardDeckControl = component$<CardDeckControlProps>(({ cardId, orientation, isSide }) => {
    const deck       = useContext(DECK_CREATION_CONTEXT);
    const cardViewer = useContext(CARD_VIEW_CONTEXT);

    const cardData = deck.cardStack[cardId];
    const card     = deck.cardInDeck[cardId];

    if (!card || !cardData) return null; // PREVENT Handling Dynamic Object Mutations https://qwik.dev/docs/core/state/#usestore

    return (
            <div
                    class={`group aspect-2.5/3.5 border-4 overflow-hidden rounded-[5%/3.571428571428571%] bg-cover ${deck.splashArtId ===
                    cardId ?
                            'border-secondary' :
                            'border-[#181A1B]'} ${orientation === 'horizontal' ?
                            'md:w-[50%] w-1/2 lg:w-[50%] xl:w-[50%] 2xl:w-[33%] sm:w-[33%]' :
                            'md:w-[50%] w-1/2 lg:w-[50%] xl:w-[33%] 2xl:w-[33%]'} bg-no-repeat bg-size-[100%_100%] relative flex flex-col`}
                    style={{
                        backgroundImage: `url(${cardData.image})`
                    }}
                    onClick$={() => {
                        void cardViewer.setCard(cardData);
                        cardViewer.isOpen = true;
                    }}
            >
                <div class="md:opacity-0 md:group-hover:opacity-100 inline top-[30%] right-[10%] z-10 absolute">
                    <ButtonIcon disabled={deck.splashArtId === card.id}
                                onClick$={() => deck.setSplashArt(card.id)}
                                stoppropagation:click
                    >
                        <Icon name="art" width={16} height={16} class="fill-primary"/>
                    </ButtonIcon>
                </div>
                <div class="absolute text-white select-none  w-full h-full flex justify-center items-center">
                    <div class="relative">
                    </div>
                    <span class="text-[4vh] font-bold p-4 bg-[#00000090]">x{isSide ?
                            card.quantityInSide :
                            card.quantity}</span>
                </div>


                <div
                        class="md:opacity-0 md:group-hover:opacity-100 absolute flex bottom-0 w-full h-[32px] justify-around flex-row-reverse gap-1 p-[4px]"
                >
                    <div
                            class={`flex select-none items-center ${isSide ?
                                    'bg-pink-800' :
                                    ' bg-orange-600'} w-[calc(32px+2vw)] border-2 border-black rounded justify-center hover:cursor-pointer`}
                            onClick$={() => deck.addCard(cardData, isSide)}
                            stoppropagation:click
                    >
                        +
                    </div>
                    <div
                            class={`${isSide ?
                                    'bg-pink-800' :
                                    ' bg-orange-600'} select-none w-[calc(32px+2vw)] border-2 border-black rounded flex justify-center items-center hover:cursor-pointer`}
                            onClick$={() => deck.removeCard(card.id, isSide)}
                            stoppropagation:click
                    >
                        -
                    </div>
                </div>
            </div>
    )
});
