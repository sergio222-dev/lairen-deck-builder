import { component$, useContext, useStore } from '@builder.io/qwik';
import { FilterContext } from '~/stores/filterContext';

interface CardCollectionPageState {
  ownedCards: Set<number>;
}

export const CardCollectionPage = component$(() => {
  const filterContext = useContext(FilterContext);
  const state = useStore<CardCollectionPageState>({
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
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">Card Collection</h1>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filterContext.cards.map((card) => (
          <div key={card.id} class="border p-2 rounded shadow">
            <img src={card.image} alt={card.name} class="w-full h-32 object-cover mb-2" />
            <div class="flex justify-between items-center">
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
    </div>
  );
});

export default CardCollectionPage;
