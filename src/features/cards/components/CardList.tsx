import { component$, useContext } from '@builder.io/qwik';
import { FilterContext } from '~/stores/filterContext';

interface CardListProps {
}

export const CardList = component$<CardListProps>(() => {
  const c = useContext(FilterContext);

  return (
    <div class="p-4 shadow-lg m-4 flex flex-wrap justify-around">
      {c.cards.map((card) => (
        <div class="p-4 flex md:w-1/5" key={card.id}>
          <img loading='lazy' width={400} height={400} alt={card.name} src={card.image} />
        </div>
      ))}
    </div>
  );
});
