export interface AlbumCardWithTagsProjection {
  id: number;
  name: string;
  image: string;
  tags: {
    quantity: number;
    name: string;
    id: number;
  }[];
}

export interface AlbumCardWithCursorProjection {
  album_cards: AlbumCardWithTagsProjection[];
  cursor: string | null;
}
