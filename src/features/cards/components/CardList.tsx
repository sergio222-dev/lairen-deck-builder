import { component$, useContext } from '@builder.io/qwik';
import { CardViewerContext }      from "~/stores/cardViewerContext";
import { FilterContext } from '~/stores/filterContext';

interface CardListProps {
}

export const CardList = component$<CardListProps>(() => {
  const c = useContext(FilterContext);
  const cardViewer = useContext(CardViewerContext);

  return (
    <div class="sm:p-0 shadow-lg flex flex-wrap justify-around">
      {c.cards.map((card) => (
        <div class="p-4 aspect-[2.5/3.5] flex w-1/2 md:w-1/4 lg:w-1/5" key={card.id} onClick$={() => {
          void cardViewer.setCard(card);
          cardViewer.isOpen = true;
        }}>
          <img class="rounded-[5%/3.571428571428571%]" loading='lazy' width={400} height={400} alt={card.name} src={card.image} />
        </div>
      ))}
    </div>
  );
});
