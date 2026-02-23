import { server$ } from '@builder.io/qwik-city';
import { TOKENS }  from '~/app/shared/binds/TOKENS';
import { IoC }     from '~/lib/IoC';

export const listAlbumsServer = server$(async () => {
  const ioc = IoC.instance;

  const getAlbums = ioc.resolve(TOKENS.GET_ALBUMS_PRESENTER);

  return await getAlbums.execute();
})
