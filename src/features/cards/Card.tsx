import { component$, useContextProvider } from '@builder.io/qwik';
import { useDominionFilters }             from "~/features/cards/hooks/useDominionFilter";
import { useCardsLoader }                 from '~/routes/cards';
import { CardFilter }                     from './components/CardFilter';
import { CardList }                       from './components/CardList';
import type { FilterContextState }        from '~/stores/filterContext';
import { FilterContext, useFilterStore }  from '~/stores/filterContext';

export const Card = component$(() => {
  const preloadedCards = useCardsLoader();
  const dominionFilter = useDominionFilters();
  const storeCards     = useFilterStore(preloadedCards.value.cards, preloadedCards.value.count, 20, [dominionFilter]);

  useContextProvider<FilterContextState>(FilterContext, storeCards);

  return (
    <div class="flex flex-col h-full w-full">
      <div class="p-2">
        <CardFilter/>
      </div>
      <div class="flex-1 overflow-y-auto">
        <CardList/>
      </div>
    </div>
  );
});
