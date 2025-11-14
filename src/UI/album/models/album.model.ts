import type { QRL }             from '@builder.io/qwik';
import { z, zod$ }              from '@builder.io/qwik-city';
import type { NormalizedModel } from '~/utils/normalize';

// Album Creation

export const albumCreationValidator = zod$({
  name: z.string(),
  sets: z.array(z.string()),
  tags: z.array(z.string())
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

export interface UIAlbum {
  id: number;
  name: string;
  total: number;
  current: number;
  sets: string[];
  tags: string[];
  cards: NormalizedModel<UIAlbumCard>;
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
  addedCards: number[];
  editMode: boolean;
  changes: Record<string,  UIAlbumChange>;
  cardTags: Record<string, UIAlbumCardTag>;
  totalTags: Record<string, number>;
  filteredCards: number[];
  filterText: string;
}

export interface AlbumViewStoreAction {
  queryCards: QRL<(this: AlbumViewStoreState, query: string) => void>;
  applyFilter: QRL<(this: AlbumViewStoreState, text: string) => void>
  addCard: QRL<(this: AlbumViewStoreState, cardId: number) => void>;
  increaseQuantity: QRL<(this: AlbumViewStoreState, cardId: number, tag: number) => void>;
  decreaseQuantity: QRL<(this: AlbumViewStoreState, cardId: number, tag: number) => void>;
  resetChanges: QRL<(this: AlbumViewStoreState) => void>;
  saveChanges: QRL<(this: AlbumViewStoreState) => void>;
}

export type ALBUM_VIEW_STORE = AlbumViewStoreState & AlbumViewStoreAction;
