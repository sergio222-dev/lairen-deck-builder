import { $, createContextId, useStore }               from '@builder.io/qwik';
import type { ALBUM_LIST_STORE, AlbumListStoreState } from '~/UI/album/models/album.model';
import { deleteAlbumServer } from '~/UI/album/service/deleteAlbum.server';
import { listAlbumsServer }  from '~/UI/album/service/listAlbums.server';

export const albumListStoreInitialState: AlbumListStoreState = {
  albums:        [],
  availableSets: []
};

export const useListAlbumStore = (initialState: AlbumListStoreState | null = null) => {
  return useStore<ALBUM_LIST_STORE>({
    ...initialState ?? albumListStoreInitialState,
    listAlbums:  $(async function(this) {
      this.albums = await listAlbumsServer();
    }),
    deleteAlbum: $(async function(this, albumId) {
      await deleteAlbumServer(albumId);
      this.albums = await listAlbumsServer();
    })
  });
};

export const ALBUM_LIST_CONTEXT = createContextId<ALBUM_LIST_STORE>('ALBUM_LIST_CONTEXT');
