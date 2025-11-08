export interface AlbumRawDto {
  id: number;
  name: string;
  sets: string[];
  owner: string;
  total: number;
  current: number;

  album_tag: {
    id: number;
    name: string;
  }[];

  album_cards: {
    cards: {
             id: number;
             name: string;
             image: string;
           } | null; // pueden venir null si la relación falla
    album_card_tags: {
      quantity: number;
      album_tag: {
                   name: string;
                   id: number;
                 } | null;
    }[];
  }[];
}

export type AlbumCardRaw = AlbumRawDto['album_cards'][number];
export type AlbumCardTagRaw = AlbumRawDto['album_cards'][number]['album_card_tags'][number];
