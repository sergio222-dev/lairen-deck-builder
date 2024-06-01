import { $, component$, useContextProvider, useSignal } from '@builder.io/qwik';
import { CardFilter }                                   from '~/features/cards';
import { CardDeckInfo }                                 from '~/features/decks/components/CardDeckInfo';
import { CardListDeck }                              from '~/features/decks/components/CardListDeck';
import { CreateForm }                                from '~/features/decks/components/CreateForm';
import { useCardDeckLoader }                         from '~/providers/loaders/cards';
import { useDeckLoader } from '~/routes/decks/create/[...id]';
import { DeckCreationContext, useDeckCreationStore } from '~/stores/deckCreationContext';
import { FilterContext, useFilterStore }             from '~/stores/filterContext';

export const Create = component$(() => {
  const buttonDisabled = useSignal(false);

  const preloadedCards = useCardDeckLoader();
  const preloadedDeck = useDeckLoader();

  const cardStore      = useFilterStore(preloadedCards.value.cards, preloadedCards.value.count, 24);
  const deckStore      = useDeckCreationStore(preloadedDeck.value);

  useContextProvider(FilterContext, cardStore);
  useContextProvider(DeckCreationContext, deckStore);

  return (
    <div>
      <CreateForm />
      <CardFilter />
      <CardListDeck />
      <CardDeckInfo />
      <button
        class="hover:bg-pink-800 hover:text-white ring-2 ring-pink-800 fixed bottom-[1%] right-[1%] p-4 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={buttonDisabled.value}
        onClick$={$(async () => {
          buttonDisabled.value = true;
          await deckStore.createDeck();
          buttonDisabled.value = false;
        })}
      >CREATE/UPDATE
      </button>
    </div>
  );
});
