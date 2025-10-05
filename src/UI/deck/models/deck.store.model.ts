import type { QRL }           from '@builder.io/qwik';
import type { CardStackItem } from '~/UI/shared/models/CardSackItem'; // TODO: Should move this to here?

export interface CardInDeckItem {
  id: number;
  quantity: number;
  quantityInSide: number;
}

export interface BasicDeckInformationUI {
  deckId: number;
  name: string;
  description: string | null;
  splashArt?: string;
  isPublic: boolean;
}

export interface DeckInformationUI extends BasicDeckInformationUI {
  cardStack: Record<string, CardStackItem>;
  cardInDeck: Record<string, CardInDeckItem>;
  type1: string | null;
  type2: string | null;
}


export interface DeckStatsUI {
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
}

// DECK CREATION
export interface DeckCreationStoreState extends DeckStatsUI, DeckInformationUI {}

export interface DeckCreationStoreAction {
  addCard: QRL<(this: DeckCreationStoreState, cardData: CardStackItem, side?: boolean) => void>;
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
  decks: BasicDeckInformationUI[];
}

export type DECK_LIST_STORE = DeckListStoreState;

// DECK PREVIEW
export interface DeckPreviewStoreState extends DeckStatsUI, DeckInformationUI {}

export type DECK_PREVIEW_STORE = DeckPreviewStoreState;
