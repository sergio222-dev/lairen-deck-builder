import { component$, useContext, useStylesScoped$ } from "@builder.io/qwik";
import { useDeckQuantity } from "~/hooks/useDeckQuantity";
import type { Card } from "~/models/Card";
import { CardViewerContext } from "~/stores/cardViewerContext";
import { DeckCreationContext } from "~/stores/deckCreationContext";
import { Icon } from "~/components/icons/Icon";

interface CardDeckProps {
    card: Card;
}

export const CardDeck = component$<CardDeckProps>(({ card }) => {
    const d = useContext(DeckCreationContext);
    const cardViewer = useContext(CardViewerContext);

    const deckData = d.deckData;

    const [deckQuantity] = useDeckQuantity(deckData, card.id);

    const [sideQuantity] = useDeckQuantity(deckData, card.id, true);

    useStylesScoped$(`
  .card-text-shadow {
    text-shadow: -1px 1px 0 #FFF, 1px 1px 0 #FFF, 1px -1px 0 #FFF;
   }
  `);

    return (
        <div class="w-[calc(50%-0.5rem)] sm:w-[calc(50%-0.5rem)] md:w-[calc(100%-0.5rem)] lg:w-[calc(50%-0.5rem)] xl:w-[calc(33%-0.5rem)] 2xl:w-[calc(33%-0.5rem)]">
            <div
                class={`select-none relative aspect-[2.5/3.5] cursor-pointer rounded-card bg-[length:100%_auto] bg-[50%_25%]
       bg-no-repeat ring-secondary transition-all hover:animate-wiggle hover:bg-[length:100%_auto] hover:shadow-[0px_0px_10px_3px] hover:shadow-secondary hover:ring-1`}
                key={card.id}
                style={{
                    backgroundImage: `url(${card.image})`,
                    backgroundSize: "calc(100% + 3px) auto",
                    backgroundPosition: "center",
                }}
                onClick$={() => d.addCard(card, false)}
            >
                <div
                    class="absolute right-2 top-2 z-10 flex h-12 w-12 ring-2 ring-secondary cursor-pointer items-center justify-center rounded-full bg-white bg-opacity-75 shadow-lg transition-all duration-200 hover:scale-110 hover:bg-opacity-90"
                    onClick$={(event) => {
                        void cardViewer.setCard(card);
                        cardViewer.isOpen = true;
                        event.stopPropagation();
                    }}
                >
                    <Icon name="magnifying-glass" height={28} width={28} class={"fill-secondary"} />
                </div>
            </div>

            <div class="flex justify-between overflow-x-auto">
                <div class="flex items-center gap-1 p-[4px]">
                    <div
                        class="flex h-[calc(1rem+1vw)] w-[calc(1rem+1vw)] select-none items-center justify-center rounded border-2 border-black bg-pink-800 hover:cursor-pointer"
                        style={sideQuantity.value === 0 ? { backgroundColor: "gray" } : {}}
                        onClick$={() => d.removeCard(card, true)}
                    >
                        -
                    </div>
                    <div
                        class="flex h-[calc(1rem+1vw)] w-[calc(1rem+1vw)] items-center justify-center rounded-[50%] border-2 border-black bg-pink-800 px-2 text-white"
                        style={sideQuantity.value === 0 ? { backgroundColor: "gray" } : {}}
                    >
                        <span>{sideQuantity.value}</span>
                    </div>
                    <div
                        class="flex h-[calc(1rem+1vw)] w-[calc(1rem+1vw)] select-none items-center justify-center rounded border-2 border-black bg-pink-800 hover:cursor-pointer"
                        style={sideQuantity.value === 0 ? { backgroundColor: "gray" } : {}}
                        onClick$={() => d.addCard(card, true)}
                    >
                        +
                    </div>
                </div>
                <div class="flex gap-1 p-[4px]">
                    <div
                        class="flex h-[calc(1rem+1vw)] w-[calc(1rem+1vw)] select-none items-center justify-center rounded border-2 border-black bg-orange-600 hover:cursor-pointer"
                        style={deckQuantity.value === 0 ? { backgroundColor: "gray" } : {}}
                        onClick$={() => d.removeCard(card, false)}
                    >
                        -
                    </div>
                    <div
                        class="flex h-[calc(1rem+1vw)] w-[calc(1rem+1vw)] items-center justify-center rounded-[50%] border-2 border-black bg-orange-600 px-2 text-white"
                        style={deckQuantity.value === 0 ? { backgroundColor: "gray" } : {}}
                    >
                        <span>{deckQuantity.value}</span>
                    </div>
                    <div
                        class="flex h-[calc(1rem+1vw)] w-[calc(1rem+1vw)] select-none items-center justify-center rounded border-2 border-black bg-orange-600 hover:cursor-pointer"
                        style={deckQuantity.value === 0 ? { backgroundColor: "gray" } : {}}
                        onClick$={() => d.addCard(card, false)}
                    >
                        +
                    </div>
                </div>
            </div>
        </div>
    );
});
