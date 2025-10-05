import type { QRL } from '@builder.io/qwik';

export interface UIAlbum {
  id: number;
  name: string;
}

export interface AlbumListStoreState {
  albums: UIAlbum[];
  availableSets: string[];
}

export interface AlbumListStoreAction {
  // getAlbum: QRL<(this: AlbumStoreState, id: string) => Promise<void>>;
  // addTag: QRL<(this: AlbumListStoreState, tag: string) => void>;
  // removeTag: QRL<(this: AlbumListStoreState, tag: string) => void>;
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
  reset: QRL<(this: AlbumCreateStoreState) => void>
}

export type ALBUM_CREATE_STORE = AlbumCreateStoreState & AlbumCreateStoreAction;
