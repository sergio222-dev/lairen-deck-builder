import type { QRL, Signal } from '@builder.io/qwik';
import type { Card }        from "~/models/Card";
import type { DeckState } from "~/models/Deck";
export type CardDeckInfoView = 'pro' | 'simple';

export interface DeckCreationContextState {
  deckData: DeckState;
  view: CardDeckInfoView;
  addCard: QRL<(this: DeckCreationContextState, card: Card, side?: boolean) => Promise<void>>;
  setSplashArt: QRL<(this: DeckCreationContextState, splashArt: string, cardId: number) => Promise<void>>;
  removeCard: QRL<(this: DeckCreationContextState, card: Card, side?: boolean) => Promise<void>>;
  createDeck: QRL<(this: DeckCreationContextState) => Promise<number>>;
  deleteDeck: QRL<(this: DeckCreationContextState) => Promise<void>>;
  cleanDeck: QRL<(this: DeckCreationContextState, partial?: boolean) => Promise<void>>;
  importDeck: QRL<(this: DeckCreationContextState, deckString: string) => Promise<void>>;
  isDeckValid: boolean;
  isDeckIgnored: boolean;
  validateDeck: QRL<(this: DeckCreationContextState) => Promise<void>>;
  subType1: string | null;
  subType2: string | null;
  types:  Readonly<Signal<string[]>>;
}
