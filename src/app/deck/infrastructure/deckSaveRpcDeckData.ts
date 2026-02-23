interface CardData {
  id: number;
  quantity: number;
  quantity_side: number;
}

export interface DeckSaveRpc_Deck_Data {
  id?: number;
  name: string;
  description: string;
  is_public: boolean;
  deck_face?: number;
  type_1?: string;
  type_2?: string;
  cards: CardData[];
}
