export interface DeckInfo {
  id: number;
  name: string;
  description: string | null;
  splashArtId: number | null;
  isPublic: boolean;
  type1: string | null;
  type2: string | null;
}

export interface DeckCardInfo {
  id: number;
  quantity: number;
  quantityInSideDeck: number;
}

export interface DeckModel extends DeckInfo {
  cards: DeckCardInfo[] | null;
}
