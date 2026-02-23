import type { QRL }             from '@builder.io/qwik';
import type { UICardStackItem } from '~/UI/shared/models/CardStackItem'; // TODO: Should move this to here?

export interface UICardInDeckItem {
  id: number;
  quantity: number;
  quantityInSide: number;
}

export interface UIBasicDeckInformation {
  deckId: number;
  name: string;
  description: string | null;
  splashArt?: string;
  isPublic: boolean;
  splashArtId?: number;
  type1: string | null;
  type2: string | null;
}

export interface UIDeckCardInformation {
  cardStack: Record<string, UICardStackItem>;
  cardInDeck: Record<string, UICardInDeckItem>;
}

export interface UIDeckInformation extends UIBasicDeckInformation, UIDeckCardInformation, UIUserCollection {
}

export interface UIUserCollection {
  collection: Record<string, number>
}


export interface UIDeckStats {
  quantityInMainDeck: number;
  quantityInSideDeck: number;
  quantityInTreasureDeck: number;
  quantityMonumentsWeaponsCards: number;
  quantityUnitsCards: number;
  quantityActionsCards: number;
  orderedUnitCards: number[];
  orderedActionCards: number[];
  orderedMonumentWeaponCards: number[];
  orderedTreasureCards: number[];
  orderedSideCards: number[];
  treasurePoints: number;
  ownedPercent: number;
}

// DECK CREATION
export interface DeckCreationStoreState extends UIDeckStats, UIDeckInformation {}

export interface DeckCreationStoreAction {
  addCard: QRL<(this: DeckCreationStoreState, cardData: UICardStackItem, side?: boolean) => void>;
  removeCard: QRL<(this: DeckCreationStoreState, cardId: number, side?: boolean) => void>;
  saveDeck: QRL<(this: DeckCreationStoreState) => Promise<number>>;
  deleteDeck: QRL<(this: DeckCreationStoreState) => void>;
  resetDeck: QRL<(this: DeckCreationStoreState) => void>;
  importDeck: QRL<(this: DeckCreationStoreState, data: string) => void>;
  copyDeck: QRL<(this: DeckCreationStoreState) => void>;
}

export type DECK_STORE = DeckCreationStoreState & DeckCreationStoreAction;

// DECK LIST
export interface DeckListStoreState {
  decks: UIBasicDeckInformation[];
}

export type DECK_LIST_STORE = DeckListStoreState;

// DECK PREVIEW
export interface DeckPreviewStoreState extends UIDeckStats, UIDeckInformation {}

export type DECK_PREVIEW_STORE = DeckPreviewStoreState;
