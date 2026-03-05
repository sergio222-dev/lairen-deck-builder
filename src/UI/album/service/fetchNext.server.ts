import { server$ }          from '@builder.io/qwik-city';
import { TOKENS }           from '~/app/shared/binds/TOKENS';
import { IoC }              from '~/lib/IoC';
import { UIAlbumCardStats } from '~/UI/album/models/album.model';

type GetNextCardsServerType = (albumId: number, query: string, cursor: string | null) => Promise<UIAlbumCardStats>;

export const fetchNextServer = server$<GetNextCardsServerType>(async (albumId, query, cursor) => {
  const getNextCards = IoC.instance.resolve(TOKENS.GET_NEXT_CARD_ALBUM_PRESENTER);

  return await getNextCards.execute(albumId, query, cursor);
});
