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
    <>
      <CardFilter/>
      <CardList/>
    </>
  );
});
