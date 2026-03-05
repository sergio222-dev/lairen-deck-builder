import { GetNextAlbumCards }        from '~/app/album/application/getNextAlbumCards';
import { TOKENS }                   from '~/app/shared/binds/TOKENS';
import { UIAlbumCardStats }         from '~/UI/album/models/album.model';
import { normalize, normalizeData } from '~/utils/normalize';

export class GetNextCardAlbumPresenter {

  static readonly inject = [TOKENS.GET_NEXT_ALBUM_CARDS];

  constructor(
    private readonly getNextAlbumCard: GetNextAlbumCards
  ) {
  }

  async execute(albumId: number, query: string, cursor: string | null): Promise<UIAlbumCardStats> {
    const s = await this.getNextAlbumCard.execute(albumId, query, cursor);

    const c = s.album_cards.map(x => {
      return {
        ...x,
        tags: normalizeData(x.tags)
      };
    });

    const nc = normalize('id', c);

    return {
      cursor:    s.cursor,
      cards:     nc,
      cardsById: c.map(x => x.id)
    };
  }
}
