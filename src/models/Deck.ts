import { CARD_TYPES } from '~/models/CardTypes';

export interface Deck {
  id: number;
  name: string;
  description?: string;
  isPrivate: boolean;
  likes: number;
  masterDeck: MasterDeck;
  sideDeck: SideDeck;
  treasureDeck: TreasureDeck;
}

export interface DeckPreview {
  masterDeck: CardDeckPreview[];
  sideDeck: CardDeckPreview[];
  treasureDeck: CardDeckPreview[];
}

export interface MasterDeck {
  id: number;
  cards: CardDeck[];
}

export interface TreasureDeck {
  id: number;
  cards: CardDeck[];
}

export interface SideDeck {
  id: number;
  cards: CardDeck[];
}

export interface CardDeckPreview {
  quantity: number;
  name: string;
  type: typeof CARD_TYPES[keyof typeof CARD_TYPES];
  image: string;
}

export interface CardDeck {
  id: number;
  quantity: number;
  // name: string;
  // type: typeof CARD_TYPES[keyof typeof CARD_TYPES];
  // image: string;
}
