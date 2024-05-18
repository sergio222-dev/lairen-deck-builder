import { Card } from '~/models/Card';

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

export interface CardDeck {
  id: number;
  quantity: number;
}
