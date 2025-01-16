import { component$, useContext, useStore } from '@builder.io/qwik';
import { FilterContext } from '~/stores/filterContext';

interface CardListState {
  ownedCards: Set<number>;
}

interface CardListProps {
}

export const CardList = component$<CardListProps>(() => {
  const c = useContext(FilterContext);
  const state = useStore<CardListState>({
    ownedCards: new Set<number>(),
  });

  const toggleOwned = (cardId: number) => {
    if (state.ownedCards.has(cardId)) {
      state.ownedCards.delete(cardId);
    } else {
      state.ownedCards.add(cardId);
    }
  };

  return (
    <div class="sm:p-0 shadow-lg flex flex-wrap justify-around">
      {c.cards.map((card) => (
        <div class="p-4 flex w-1/2 md:w-1/4 lg:w-1/5" key={card.id}>
          <img loading='lazy' width={400} height={400} alt={card.name} src={card.image} />
          <div class="flex justify-between items-center mt-2">
            <span>{card.name}</span>
            <input
              type="checkbox"
              checked={state.ownedCards.has(card.id)}
              onChange$={() => toggleOwned(card.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
});