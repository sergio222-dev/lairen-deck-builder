import type { QRL } from '@builder.io/qwik';
import { z, zod$ }  from '@builder.io/qwik-city';
import { NormalizedModel } from '~/utils/normalize';

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
  tags: UIAlbumCardTag[];
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

export interface AlbumListStoreState {
  albums: UIAlbumPreview[];
  availableSets: string[];
}

export interface AlbumListStoreAction {
  // getAlbum: QRL<(this: AlbumStoreState, id: string) => Promise<void>>;
  // addTag: QRL<(this: AlbumListStoreState, tag: string) => void>;
  // removeTag: QRL<(this: AlbumListStoreState, tag: string) => void>;
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
  addedCards: number[],
  editMode: boolean,
}

export interface AlbumViewStoreAction {
  queryCards: QRL<(this: AlbumViewStoreState, query: string) => void>;
  addCard: QRL<(this: AlbumViewStoreState, cardId: number) => void>;
}

export type ALBUM_VIEW_STORE = AlbumViewStoreState & AlbumViewStoreAction;
