import { $, createContextId, useStore }                   from '@builder.io/qwik';
import type { ALBUM_CREATE_STORE, AlbumCreateStoreState } from '~/UI/album/models/album.model';

export const albumCreateStoreInitialState: AlbumCreateStoreState = {
  availableSets: [],
  createdTags:   [],
  name:          ''
};

export const useAlbumCreateStore = (initialState: AlbumCreateStoreState | null = null) => {
  return useStore<ALBUM_CREATE_STORE>({
    ...initialState ?? albumCreateStoreInitialState,
    addTag:    $(function(this, tag) {
      if (this.createdTags.includes(tag)) return;
      this.createdTags.push(tag);
    }),
    removeTag: $(function(this, tag) {
      this.createdTags = this.createdTags.filter((t) => t !== tag);
    }),
    reset:     $(function(this) {
      this.createdTags = [];
    })
  });
};

export const ALBUM_CREATE_CONTEXT = createContextId<ALBUM_CREATE_STORE>('ALBUM_CREATE_CONTEXT');
