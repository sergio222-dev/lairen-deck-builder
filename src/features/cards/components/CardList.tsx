import { component$, useContext } from '@builder.io/qwik';
import { CARD_VIEW_CONTEXT }      from "~/UI/card/store/cardViewer.storet";
import { FILTER_CONTEXT }         from "~/UI/filters/store/filter.store";

interface CardListProps {
}

export const CardList = component$<CardListProps>(() => {
    const f          = useContext(FILTER_CONTEXT);
    const cardViewer = useContext(CARD_VIEW_CONTEXT);

    return (
            <div class="sm:p-0 shadow-lg grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {f.cards.map((id) => (
                        <div class="p-4 aspect-2.5/3.5 flex" key={id} onClick$={() => {
                            void cardViewer.setCard(f.cardStack[id]);
                            cardViewer.isOpen = true;
                        }}>
                            <img class="rounded-[5%/3.571428571428571%]" loading='lazy' width={400} height={400}
                                 alt={f.cardStack[id].name} src={f.cardStack[id].image}/>
                        </div>
                ))}
            </div>
    );
});
