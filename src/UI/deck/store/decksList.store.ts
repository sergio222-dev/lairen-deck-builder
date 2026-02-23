import type { Signal } from '@builder.io/qwik';
import { createContextId } from '@builder.io/qwik';
import { useStore }                 from '@builder.io/qwik';
import type { DECK_LIST_STORE, DeckListStoreState } from '~/UI/deck/models/deck.store.model';

export const deckListStoreInitialState: DeckListStoreState = {
  decks: []
};

export const useDeckListStore = (initialState: Signal<DeckListStoreState | null>) => {
  return useStore<DECK_LIST_STORE>({
    ...initialState.value ?? deckListStoreInitialState
  });
};

export const DECK_LIST_CONTEXT = createContextId<DECK_LIST_STORE>('DECK_LIST_CONTEXT');
