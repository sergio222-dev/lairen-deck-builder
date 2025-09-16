import type { QRL, Signal } from '@builder.io/qwik';
import type { Card }        from '~/models/Card';
import type { DeckState }   from '~/models/Deck';

export type CardDeckInfoView = 'pro' | 'simple';

export interface DeckCreationContextState extends DeckState {
  // VIEWER DATA ?
  id: number;
  name: string;
  description?: string;
  isPrivate: boolean;
  likes: number;
  subType1: string | null;
  subType2: string | null;
  splashArt?: string;
  splashArtId?: number;

  // UI STATE
  view: CardDeckInfoView;

  // ACTIONS
  addCard: QRL<(this: DeckCreationContextState, card: Card, side?: boolean) => Promise<void>>;
  setSplashArt: QRL<(this: DeckCreationContextState, splashArt: string, cardId: number) => Promise<void>>;
  removeCard: QRL<(this: DeckCreationContextState, card: Card, side?: boolean) => Promise<void>>;
  createDeck: QRL<(this: DeckCreationContextState) => Promise<number>>;
  deleteDeck: QRL<(this: DeckCreationContextState) => Promise<void>>;
  cleanDeck: QRL<(this: DeckCreationContextState, partial?: boolean) => Promise<void>>;
  importDeck: QRL<(this: DeckCreationContextState, deckString: string) => Promise<void>>;

  // VALIDATIONS
  isDeckValid: boolean;
  isDeckIgnored: boolean;
  validateDeck: QRL<(this: DeckCreationContextState) => Promise<void>>;
  types: Readonly<Signal<string[]>>;
}
