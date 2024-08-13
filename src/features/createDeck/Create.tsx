import { component$, useContextProvider, useSignal } from '@builder.io/qwik';
import { Button }                                    from "~/components/button";

import { CardFilter }                                from '~/features/cards';
import { CardDeckInfo }                              from '~/features/createDeck/components/CardDeckInfo';
import { CardListDeck }                              from '~/features/createDeck/components/CardListDeck';
import { CreateForm }                                from '~/features/createDeck/components/CreateForm';
import { useCardDeckLoader }                         from '~/providers/loaders/cards';
import { useDeckLoader }                             from '~/routes/decks/create/[...id]';
import { DeckCreationContext, useDeckCreationStore } from '~/stores/deckCreationContext';
import { FilterContext, useFilterStore }             from '~/stores/filterContext';

export const Create = component$(() => {
  const selectedSection = useSignal(0);

  const preloadedCards = useCardDeckLoader();
  const preloadedDeck  = useDeckLoader();

  const cardStore = useFilterStore(preloadedCards.value.cards, preloadedCards.value.count, 24);
  const deckStore = useDeckCreationStore(preloadedDeck.value);

  useContextProvider(FilterContext, cardStore);
  useContextProvider(DeckCreationContext, deckStore);

  return (
    <div class="h-full flex flex-col md:flex-row">
      {/*<div hidden={selectedSection.value !== 0} class="p-2 md:block md:col-span-4 md:row-span-1">*/}
      {/*</div>*/}
      <div hidden={selectedSection.value !== 0} class="h-full overflow-y-auto md:flex-1 md:block ">
        <CardFilter/>
        <CardListDeck/>
      </div>
      <div hidden={selectedSection.value !== 1} class="h-full overflow-y-auto md:flex-1 md:block">
        <div class="">
          <CreateForm/>
        </div>
        <CardDeckInfo/>
      </div>
      <div class="flex items-stretch flex-1 md:hidden">
        <div class="flex-1 p-4 bg-primary">
          <Button onClick$={() => selectedSection.value = 0} class="w-full h-full">Cartas</Button>
        </div>
        <div class="flex-1 p-4 bg-primary">
          <Button onClick$={() => selectedSection.value = 1} class="w-full h-full">Deck</Button>
        </div>
      </div>
    </div>
  );
});
