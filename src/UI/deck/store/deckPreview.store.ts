import { createContextId, useStore }                      from '@builder.io/qwik';
import type { DECK_PREVIEW_STORE, DeckPreviewStoreState } from '~/UI/deck/models/deck.store.model';

const deckPreviewStoreInitialState: DeckPreviewStoreState = {
  deckId:                        0,
  name:                          '',
  description:                   '',
  cardStack:                     {},
  cardInDeck:                    {},
  isPublic:                      false,
  orderedActionCards:            [],
  orderedSideCards:              [],
  orderedMonumentWeaponCards:    [],
  orderedTreasureCards:          [],
  orderedUnitCards:              [],
  quantityInMainDeck:            0,
  quantityActionsCards:          0,
  quantityInSideDeck:            0,
  quantityInTreasureDeck:        0,
  quantityMonumentsWeaponsCards: 0,
  quantityUnitsCards:            0,
  treasurePoints:                0,
  type1:                         null,
  type2:                         null,
  ownedPercent:                  0,
  collection:                    {}
};

export const useDeckPreviewStore = (initialState: DeckPreviewStoreState | null) => {
  return useStore<DECK_PREVIEW_STORE>({
    ...initialState ?? deckPreviewStoreInitialState
  });
};

export const DECK_PREVIEW_CONTEXT = createContextId<DECK_PREVIEW_STORE>('DECK_PREVIEW_CONTEXT');
