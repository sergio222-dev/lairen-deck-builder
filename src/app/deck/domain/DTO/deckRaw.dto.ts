export interface DeckRawDto {
  id: number;
  name: string;
  description: string | null;
  is_public: boolean;
  type_1: string | null;
  type_2: string | null;
  owner: string;
  deck_face: {
               image: string;
               id: number;
             } | null;
  deck_card: {
    card: {
      id: number;
    };
    quantity: number;
    quantity_side: number;
  }[];
}
