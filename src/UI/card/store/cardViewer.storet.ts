import { $, createContextId, useStore }          from '@builder.io/qwik';
import type { CARD_VIEW_STORE, CardViewerState } from '~/UI/card/models/card.model';
import { getCardByIdServer }                     from '~/UI/card/service/getCardById.server';

export const cardViewerStoreInitialState: CardViewerState = {
  isOpen: false
};

export const useCardViewerStore = (initialState: CardViewerState | null = null) => {
  return useStore<CARD_VIEW_STORE>({
    ...cardViewerStoreInitialState,
    ...initialState ? { ...initialState } : {},
    setCard:  $(async function(this, card) {
      this.card = card;
    }),
    showCard: $(async function(this, cardId) {
      this.card   = await getCardByIdServer(cardId);
      this.isOpen = true;
    })
  });
};

export const CARD_VIEW_CONTEXT = createContextId<CARD_VIEW_STORE>('card-viewer-context');
