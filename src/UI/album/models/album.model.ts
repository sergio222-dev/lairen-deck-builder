import type { QRL }             from '@builder.io/qwik';
import { z, zod$ }              from '@builder.io/qwik-city';
import type { NormalizedModel } from '~/utils/normalize';

// Album Creation

export const albumCreationValidator = zod$({
  name:            z.string(),
  sets:            z.array(z.string()),
  tags:            z.array(z.string()),
  initializeCards: z.string().optional()
});


export interface UIAlbumPreview {
  id: number;
  name: string;
  total: number;
  current: number;
}

export interface UIAlbumCardTag {
  id: number;
  name: string;
  quantity: number;
}

export interface UIAlbumCardSimple {
  id: number;
  name: string;
  image: string;
}

export interface UIAlbumCard {
  id: number;
  name: string;
  image: string;
  tags: NormalizedModel<UIAlbumCardTag>;
}

interface UIAlbumTag {
  id: number;
  total: number;
  name: string;
}

export interface UIAlbumTagStats {
  tags: NormalizedModel<UIAlbumTag>;
  tagsById: Array<number>;
}

export interface UIAlbumCardStats {
  cards: NormalizedModel<UIAlbumCard>;
  cardsById: Array<number>;
  cursor: string | null;
}

export type UIAlbumStats = UIAlbumTagStats & UIAlbumCardStats;

export interface UIAlbum extends UIAlbumStats {
  id: number;
  name: string;
  total: number;
  current: number;
  sets: string[];
}

export type AlbumChange = 'ADDITION' | 'REMOTION';

export interface UIAlbumChange {
  amount: number;
  tagId: number;
  cardId: number;
}

export interface AlbumListStoreState {
  albums: UIAlbumPreview[];
  availableSets: string[];
}

export interface AlbumListStoreAction {
  listAlbums: QRL<(this: AlbumListStoreState) => void>;
  deleteAlbum: QRL<(this: AlbumListStoreState, albumId: number) => void>;
}

export type ALBUM_LIST_STORE = AlbumListStoreState & AlbumListStoreAction;

export interface AlbumCreateStoreState {
  availableSets: string[];
  createdTags: string[];
  name: string;
}

export interface AlbumCreateStoreAction {
  addTag: QRL<(this: AlbumCreateStoreState, tag: string) => void>;
  removeTag: QRL<(this: AlbumCreateStoreState, tag: string) => void>;
  reset: QRL<(this: AlbumCreateStoreState) => void>;
}

export type ALBUM_CREATE_STORE = AlbumCreateStoreState & AlbumCreateStoreAction;

export interface AlbumViewStoreState extends UIAlbum {
  resultCards: NormalizedModel<UIAlbumCardSimple>,
  editMode: boolean;
  changes: Record<string, UIAlbumChange>;
  filterText: string;
}

export interface AlbumViewStoreAction {
  queryCards: QRL<(this: AlbumViewStoreState, query: string) => void>;
  resetResults: QRL<(this: AlbumViewStoreState) => void>;
  applyFilter: QRL<(this: AlbumViewStoreState, text: string) => void>;
  addCard: QRL<(this: AlbumViewStoreState, cardId: number) => void>;
  increaseQuantity: QRL<(this: AlbumViewStoreState, cardId: number, tagId: number) => void>;
  decreaseQuantity: QRL<(this: AlbumViewStoreState, cardId: number, tagId: number) => void>;
  resetChanges: QRL<(this: AlbumViewStoreState) => void>;
  saveChanges: QRL<(this: AlbumViewStoreState) => void>;
  fetchNext: QRL<(this: AlbumViewStoreState) => void>;
}

export type ALBUM_VIEW_STORE = AlbumViewStoreState & AlbumViewStoreAction;
