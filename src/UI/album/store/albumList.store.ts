import type { Signal }                                from '@builder.io/qwik';
import { $, createContextId, useStore }               from '@builder.io/qwik';
import type { ALBUM_LIST_STORE, AlbumListStoreState } from '~/UI/album/models/album.model';

export const albumListStoreInitialState: AlbumListStoreState = {
  albums:        [],
  availableSets: [],
};

export const useListAlbumStore = (initialState: Signal<AlbumListStoreState> | Signal<null>) => {
  return useStore<ALBUM_LIST_STORE>({
    ...initialState.value ?? albumListStoreInitialState,
    // addTag: $(function(this, tag) {
    //   this.createdTags.push(tag);
    // }),
    // removeTag: $(function(this, tag) {
    //   this.createdTags = this.createdTags.filter((t) => t !== tag);
    // })
    // getAlbum: $(async function(this, id) {
    //
    // })
  });
};

export const ALBUM_LIST_CONTEXT = createContextId<ALBUM_LIST_STORE>('ALBUM_LIST_CONTEXT');
