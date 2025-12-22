import { server$ } from '@builder.io/qwik-city';
import { TOKENS }  from '~/app/shared/binds/TOKENS';
import { IoC }     from '~/lib/IoC';

export const deleteAlbumServer = server$(async (albumId: number) => {
  const instance = IoC.instance;

  const deleteAlbum = instance.resolve(TOKENS.DELETE_ALBUM_PRESENTER);

  await deleteAlbum.execute(albumId);
})
