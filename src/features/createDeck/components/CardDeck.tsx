import { component$, useComputed$, useContext, useStylesScoped$ } from "@builder.io/qwik";
import { Icon }                                                   from "~/components/icons/Icon";
import { CardViewerContext }                                      from "~/stores/cardViewerContext";
import { DECK_CREATION_CONTEXT }                                  from "~/UI/deck/store/deckCreation.store";
import { FILTER_CONTEXT }                                         from "~/UI/filters/store/filter.store";

interface CardDeckProps {
    cardId: number;
}

export const CardDeck = component$<CardDeckProps>(({ cardId }) => {
    const d          = useContext(DECK_CREATION_CONTEXT);
    const f          = useContext(FILTER_CONTEXT);
    const cardViewer = useContext(CardViewerContext);

    const quantityInMainDeck = useComputed$(() => {
        return d.cardInDeck[cardId] ? d.cardInDeck[cardId].quantity : 0;
    })

    const quantityInSideDeck = useComputed$(() => {
        return d.cardInDeck[cardId] ? d.cardInDeck[cardId].quantityInSide : 0;
    });

    useStylesScoped$(`
  .card-text-shadow {
    text-shadow: -1px 1px 0 #FFF, 1px 1px 0 #FFF, 1px -1px 0 #FFF;
   }
  `);

    return (
            <div class="w-[calc(50%-0.5rem)] sm:w-[calc(50%-0.5rem)] md:w-[calc(100%-0.5rem)] lg:w-[calc(50%-0.5rem)] xl:w-[calc(33%-0.5rem)] 2xl:w-[calc(33%-0.5rem)]">
                <div
                        class={`select-none relative aspect-[2.5/3.5] cursor-pointer rounded-card bg-[length:100%_auto] bg-[50%_25%]
       bg-no-repeat ring-secondary transition-all hover:md:animate-wiggle hover:bg-[length:100%_auto] hover:shadow-[0px_0px_10px_3px] hover:shadow-secondary hover:ring-1`}
                        style={{
                            backgroundImage:    `url(${f.cardStack[cardId].image})`,
                            backgroundSize:     "calc(100% + 3px) auto",
                            backgroundPosition: "center",
                        }}
                        onClick$={() => d.addCard(f.cardStack[cardId], false)}
                >
                    <div
                            class="absolute right-2 top-2 z-10 flex h-12 w-12 ring-2 ring-secondary cursor-pointer items-center justify-center rounded-full bg-white bg-opacity-75 shadow-lg transition-all duration-200 hover:scale-110 hover:bg-opacity-90"
                            onClick$={() => {
                                void cardViewer.setCard(f.cardStack[cardId]);
                                cardViewer.isOpen = true;
                            }}
                            stoppropagation:click
                    >
                        <Icon name="magnifying-glass" height={28} width={28} class={"fill-secondary"}/>
                    </div>
                </div>

                <div class="flex justify-between overflow-x-auto">
                    <div class="flex items-center gap-1 p-[4px]">
                        <div
                                class="flex h-[calc(1rem+1vw)] w-[calc(1rem+1vw)] select-none items-center justify-center rounded border-2 border-black bg-pink-800 hover:cursor-pointer"
                                style={quantityInSideDeck.value === 0 ? { backgroundColor: "gray" } : {}}
                                onClick$={() => d.removeCard(cardId, true)}
                        >
                            -
                        </div>
                        <div
                                class="flex h-[calc(1rem+1vw)] w-[calc(1rem+1vw)] items-center justify-center rounded-[50%] border-2 border-black bg-pink-800 px-2 text-white"
                                style={quantityInSideDeck.value === 0 ? { backgroundColor: "gray" } : {}}
                        >
                            <span>{quantityInSideDeck.value}</span>
                        </div>
                        <div
                                class="flex h-[calc(1rem+1vw)] w-[calc(1rem+1vw)] select-none items-center justify-center rounded border-2 border-black bg-pink-800 hover:cursor-pointer"
                                style={quantityInSideDeck.value === 0 ? { backgroundColor: "gray" } : {}}
                                onClick$={() => d.addCard(f.cardStack[cardId], true)}
                        >
                            +
                        </div>
                    </div>
                    <div class="flex gap-1 p-[4px]">
                        <div
                                class="flex h-[calc(1rem+1vw)] w-[calc(1rem+1vw)] select-none items-center justify-center rounded border-2 border-black bg-orange-600 hover:cursor-pointer"
                                style={quantityInMainDeck.value === 0 ? { backgroundColor: "gray" } : {}}
                                onClick$={() => d.removeCard(cardId)}
                        >
                            -
                        </div>
                        <div
                                class="flex h-[calc(1rem+1vw)] w-[calc(1rem+1vw)] items-center justify-center rounded-[50%] border-2 border-black bg-orange-600 px-2 text-white"
                                style={quantityInMainDeck.value === 0 ? { backgroundColor: "gray" } : {}}
                        >
                            <span>{quantityInMainDeck}</span>
                        </div>
                        <div
                                class="flex h-[calc(1rem+1vw)] w-[calc(1rem+1vw)] select-none items-center justify-center rounded border-2 border-black bg-orange-600 hover:cursor-pointer"
                                style={quantityInMainDeck.value === 0 ? { backgroundColor: "gray" } : {}}
                                onClick$={() => d.addCard(f.cardStack[cardId], false)}
                        >
                            +
                        </div>
                    </div>
                </div>
            </div>
    );
});
