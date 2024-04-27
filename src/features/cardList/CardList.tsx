import { component$, useSignal, useStore } from '@builder.io/qwik';
import type { Card }                       from '~/models/Card';

interface CardListProps {
  cards: Card[];
}

export const CardList = component$<CardListProps>(({ cards }) => {

  return (
    <div class="p-4 shadow-lg m-4 flex flex-wrap justify-around">
      {cards.map((card) => (
        <div class="p-4 flex md:w-2/12 lg:1/12" key={card.id}><img width={400} height={400} alt={card.name} src={card.image} /> </div>
      ))}
    </div>
  );
});
