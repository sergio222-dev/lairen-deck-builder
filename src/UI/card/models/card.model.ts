import type { QRL } from '@builder.io/qwik';

export interface UICard {
  id: number;
  name: string;
  rarity: string;
  type: string;
  supertype: string;
  subtype1: string;
  subtype2: string;
  cost: number;
  text: string;
  image: string;
  thumbnail: string;
  set: string;
  clarifications: string | null;
}


export interface CardViewerState {
  card?: UICard;
  isOpen: boolean;
}

export interface CardViewerAction {
  setCard: QRL<(this: CardViewerState, card: UICard) => void>;
  showCard: QRL<(this: CardViewerState, cardId: number) => void>;
}

export type CARD_VIEW_STORE = CardViewerState & CardViewerAction;
