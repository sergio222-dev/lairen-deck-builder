import type { QRL }  from "@builder.io/qwik";
import type { Card } from "~/models/Card";
import type { DeckState } from "~/models/Deck";

export interface DeckCreationContextState {
  deckData: DeckState;
  addCard: QRL<(this: DeckCreationContextState, card: Card, side?: boolean) => Promise<void>>;
  setSplashArt: QRL<(this: DeckCreationContextState, splashArt: string, cardId: number) => Promise<void>>;
  removeCard: QRL<(this: DeckCreationContextState, card: Card, side?: boolean) => Promise<void>>;
  createDeck: QRL<(this: DeckCreationContextState) => Promise<number>>;
  cleanDeck: QRL<(this: DeckCreationContextState, partial?: boolean) => Promise<void>>;
  importDeck: QRL<(this: DeckCreationContextState, deckString: string) => Promise<void>>;
}
