import type { Card }            from "~/models/Card";
import type { NormalizedModel } from "~/utils/normalize";

export interface DeckCard extends Card {
  quantity: number;
}

export interface DeckItem {
  id: number;
  name: string;
  description: string | null;
  likes: number;
  splashArt?: string;
}

export interface DeckState {
  masterDeck: NormalizedModel<DeckCard>;
  sideDeck: NormalizedModel<DeckCard>;
  treasureDeck: NormalizedModel<DeckCard>;
  id: number;
  name: string;
  description?: string;
  isPrivate: boolean;
  likes: number;
  splashArt?: string;
  splashArtId?: number;
}
