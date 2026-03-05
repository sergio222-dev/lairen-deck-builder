export interface AlbumRawDto {
  id: number;
  name: string;
  sets: string[];
  owner: string;
  total: number;
  current: number;

  album_tags: {
    id: number;
    name: string;
  }[];

  album_cards: {
    // quantity: number;
    cards: {
      id: number;
      // name: string;
      // image: string;
    }
    // tags: {
    //   name: string;
    //   id: number;
    // }[];
  }[];
}

// export type AlbumCardRaw = AlbumRawDto['album_cards'][number];
// export type AlbumCardTagRaw = AlbumRawDto['album_cards'][number]['album_card_tags'][number];
