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
  const selectedSection   = useSignal(0);
  const mobileListDeckRef = useSignal<HTMLDivElement>();

  const preloadedCards = useCardDeckLoader();
  const preloadedDeck  = useDeckLoader();

  const cardStore = useFilterStore(preloadedCards.value.cards, preloadedCards.value.count, 24);
  const deckStore = useDeckCreationStore(preloadedDeck.value);

  useContextProvider(FilterContext, cardStore);
  useContextProvider(DeckCreationContext, deckStore);

  return (
    <div class="h-full flex flex-col md:flex-row w-full">
      <div hidden={selectedSection.value !== 0} class="h-full md:basis-[50%] xl:basis-[61.8%] overflow-y-hidden md:block px-2 pt-2">
        <div class="flex flex-col h-full">
          <div>
            <CardFilter mobileListDeckRef={mobileListDeckRef}/>
          </div>
          <div class="overflow-y-auto py-2" ref={mobileListDeckRef}>
            <CardListDeck/>
          </div>
        </div>
      </div>
      <div hidden={selectedSection.value !== 1} class="h-full md:basis-[50%] xl:basis-[38.2%] overflow-y-auto py-2 md:block">
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
