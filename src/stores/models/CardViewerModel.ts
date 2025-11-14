import type { QRL }           from '@builder.io/qwik';
import type { CardStackItem } from '~/UI/shared/models/CardSackItem';

export interface CardViewerState {
  card?: CardStackItem;
  isOpen: boolean;
}

export interface CardViewerAction {
  setCard: QRL<(this: CardViewerState, cardId: CardStackItem) => void>;
  fetchCard: QRL<(this: CardViewerState, cardId: number) => void>;
}

export type CARD_VIEW_STORE = CardViewerState & CardViewerAction;
