import { server$ }                from '@builder.io/qwik-city';
import { TOKENS }                 from '~/app/shared/binds/TOKENS';
import { IoC }                    from '~/lib/IoC';
import type { UIAlbumCardSimple } from '~/UI/album/models/album.model';

export const QueryCardServer = server$<(query: string) => Promise<UIAlbumCardSimple[]>>(async (query) => {
  const instance = IoC.instance;

  try {
    const queryCard = instance.resolve(TOKENS.QUERY_CARDS_PRESENTER);
    return await queryCard.execute({
      query
    });
  } catch (e) {
    console.error(e);
  }

  return [];

});
