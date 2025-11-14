import { server$ }                  from '@builder.io/qwik-city';
import { TOKENS }                   from '~/app/shared/binds/TOKENS';
import { IoC }                      from '~/lib/IoC';
import type { AlbumViewStoreState } from '~/UI/album/models/album.model';

type GetAlbumServerType = (albumId: number) => Promise<AlbumViewStoreState>;

export const getAlbumServer = server$<GetAlbumServerType>(async (albumId) => {
  const ioc = IoC.instance;

  const getAlbum = ioc.resolve(TOKENS.GET_ALBUM_VIEW_STATE_PRESENTER);

  return await getAlbum.execute(albumId);
});
