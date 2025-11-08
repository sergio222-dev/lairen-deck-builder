import { $, createContextId, useStore }               from '@builder.io/qwik';
import { getAlbumsPresenter }                         from '~/app/album/presenter/getAlbumsPresenter';
import type { ALBUM_LIST_STORE, AlbumListStoreState } from '~/UI/album/models/album.model';

export const albumListStoreInitialState: AlbumListStoreState = {
  albums:        [],
  availableSets: []
};

export const useListAlbumStore = (initialState: AlbumListStoreState | null = null) => {
  return useStore<ALBUM_LIST_STORE>({
    ...initialState ?? albumListStoreInitialState,
    listAlbums: $(async function(this) {
      this.albums = await getAlbumsPresenter();
    })
  });
};

export const ALBUM_LIST_CONTEXT = createContextId<ALBUM_LIST_STORE>('ALBUM_LIST_CONTEXT');
