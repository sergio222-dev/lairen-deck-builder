import { server$ }             from '@builder.io/qwik-city';
import { TOKENS }              from '~/app/shared/binds/TOKENS';
import { IoC }                 from '~/lib/IoC';
import type { UIAlbumPreview } from '~/UI/album/models/album.model';

type S = () => Promise<UIAlbumPreview[]>

export const getAlbumsPresenter = server$<S>(async () => {
    const instance = IoC.instance;

    const getCurrentUser = instance.resolve(TOKENS.GET_CURRENT_USER);
    const getAlbums      = instance.resolve(TOKENS.GET_ALBUMS);

    const user   = await getCurrentUser.execute();
    const albums = await getAlbums.execute(user.id);

    return albums.map(u => ({
      name:    u.name.value,
      id:      u.id.value,
      current: u.current.value,
      total:   u.total.value
    }));
  }
);
