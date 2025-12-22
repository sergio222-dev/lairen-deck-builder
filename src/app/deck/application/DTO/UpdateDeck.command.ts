interface UpdateCardCommand {
  cardId: number;
  quantity: number;
  quantitySide: number;
}

export interface UpdateDeckCommand {
  id: number;
  name: string;
  description: string | null;
  isPublic: boolean;
  cards: UpdateCardCommand[];
  type1: string | null;
  type2: string | null;
  splashArtId: number | null;
}
