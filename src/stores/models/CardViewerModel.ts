import type { QRL }           from '@builder.io/qwik';
import type { CardView }      from '~/stores/models/CardView';
import type { CardStackItem } from '~/UI/shared/models/CardSackItem';

export interface CardViewerState {
  card?: CardView;
  isOpen: boolean;
  setCard: QRL<(this: CardViewerState, cardId: CardStackItem) => void>;
}
