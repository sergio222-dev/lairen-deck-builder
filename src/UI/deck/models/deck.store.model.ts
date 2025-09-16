import type { QRL }           from '@builder.io/qwik';
import type { CardStackItem } from '~/UI/shared/models/CardSackItem';

export interface DeckCreationCardState {
  id: number;
  quantity: number;
  quantityInSide: number;
}


export interface DeckCreationStoreState {
  deckId: number;
  name: string;
  description: string | null;
  splashArtId: number | null;
  isPublic: boolean;
  type1: string | null;
  type2: string | null;
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
  cardStack: Record<string, CardStackItem>;
  cardInDeck: Record<string, DeckCreationCardState>;
}

export interface DeckCreationStoreAction {
  addCard: QRL<(this: DeckCreationStoreState, cardData: CardStackItem, side?: boolean) => void>;
  removeCard: QRL<(this: DeckCreationStoreState, cardId: number, side?: boolean) => void>
}
