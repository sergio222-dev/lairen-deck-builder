import type { QRL }             from '@builder.io/qwik';
import type { UICardStackItem } from '~/UI/shared/models/CardSackItem';

export interface CardViewerState {
  card?: UICardStackItem;
  isOpen: boolean;
}

export interface CardViewerAction {
  setCard: QRL<(this: CardViewerState, cardId: UICardStackItem) => void>;
  fetchCard: QRL<(this: CardViewerState, cardId: number) => void>;
}

export type CARD_VIEW_STORE = CardViewerState & CardViewerAction;
