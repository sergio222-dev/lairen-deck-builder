import { component$, useContextProvider } from '@builder.io/qwik';
import { useCardsLoader }                 from '~/routes/cards';
import { CardFilter }                     from './components/CardFilter';
import { CardList }                       from './components/CardList';
import type { FilterContextState }        from '~/stores/filterContext';
import { FilterContext, useFilterStore }  from '~/stores/filterContext';

export const Card = component$(() => {
  const preloadedCards = useCardsLoader();
  const storeCards     = useFilterStore(preloadedCards.value.cards, preloadedCards.value.count);

  useContextProvider<FilterContextState>(FilterContext, storeCards);

  return (
    <div class="flex flex-col h-full">
      <div class="p-2">
        <CardFilter/>
      </div>
      <div class="flex-1 overflow-y-auto">
        <CardList/>
      </div>
    </div>
  );
});
