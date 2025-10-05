import { component$, useContext } from '@builder.io/qwik';
import { CardViewerContext }      from "~/stores/cardViewerContext";
import { FILTER_CONTEXT }         from "~/UI/filters/store/filter.store";

interface CardListProps {
}

export const CardList = component$<CardListProps>(() => {
    const f = useContext(FILTER_CONTEXT);
    const cardViewer = useContext(CardViewerContext);

    return (
            <div class="sm:p-0 shadow-lg flex flex-wrap justify-around">
                {f.cards.map((id) => (
                        <div class="p-4 aspect-[2.5/3.5] flex w-1/2 md:w-1/4 lg:w-1/5" key={id} onClick$={() => {
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
