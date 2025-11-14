import { server$ }                from '@builder.io/qwik-city';
import { TOKENS }                 from '~/app/shared/binds/TOKENS';
import { IoC }                    from '~/lib/IoC';
import type { UIAlbumCardSimple } from '~/UI/album/models/album.model';

export const queryCardServer = server$<(query: string, sets: string[]) => Promise<UIAlbumCardSimple[]>>(async (query, sets) => {
  const instance = IoC.instance;

  try {
    const queryCard = instance.resolve(TOKENS.QUERY_CARDS_PRESENTER);
    return await queryCard.execute({
      query,
      sets
    });
  } catch (e) {
    console.error(e);
  }

  return [];

});
