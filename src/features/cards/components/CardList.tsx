import { component$ } from '@builder.io/qwik';
import type { Card }                       from '~/models/Card';

interface CardListProps {
  cards: Card[];
}

export const CardList = component$<CardListProps>(({ cards }) => {

  return (
    <div class="p-4 shadow-lg m-4 flex flex-wrap justify-around">
      {cards.map((card) => (
        <div class="p-4 flex md:w-1/5" key={card.id}>
          <img width={400} height={400} alt={card.name} src={card.image} />
        </div>
      ))}
    </div>
  );
});
