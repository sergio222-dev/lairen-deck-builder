import { component$ } from '@builder.io/qwik';
import { Card }                           from '~/features/cards';

export { useSubtypeLoader, useCardsLoader, useTypeLoader, useRarityLoader, useSetLoader } from '~/providers/loaders/cards';

export default component$(() => {
  // const storeCards = useFilterStore();
  //
  // useContextProvider<FilterContextState>(FilterContext, storeCards);

  return (
      <Card />
  );
});
