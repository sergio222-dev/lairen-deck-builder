import type { GetAlbum }     from '~/app/album/application/getAlbum';
import { GetAlbumStats }     from '~/app/album/application/getAlbumStats';
import { GetNextAlbumCards } from '~/app/album/application/getNextAlbumCards';
import { TOKENS }            from '~/app/shared/binds/TOKENS';

import type { AlbumViewStoreState } from '~/UI/album/models/album.model';
import { normalize, normalizeData } from '~/utils/normalize';

export class GetAlbumViewStatsPresenter {
  static readonly inject = [TOKENS.GET_ALBUM, TOKENS.GET_NEXT_ALBUM_CARDS, TOKENS.GET_ALBUM_STATS];

  constructor(
    private getAlbum: GetAlbum,
    private readonly getNextAlbumCard: GetNextAlbumCards,
    private readonly getAlbumStats: GetAlbumStats
  ) {
  }

  async execute(albumId: number): Promise<AlbumViewStoreState> {
    const album = await this.getAlbum.execute(albumId);
    const cards = await this.getNextAlbumCard.execute(albumId, '');
    const stats = await this.getAlbumStats.execute(albumId);

    const c = cards.album_cards.map(x => {
      return {
        ...x,
        tags: normalizeData(x.tags)
      };
    });

    const nc       = normalize('id', c);
    const cardsIds = c.map(x => x.id);

    const t: Record<string, number> = {};

    cards.album_cards.forEach(c => {
      c.tags.forEach(tt => {

        if (!t[tt.name]) {
          t[tt.name] = tt.quantity;
        } else {
          t[tt.name] += tt.quantity;
        }
      });
    });

    return {
      cursor:      cards.cursor,
      id:          album.id,
      name:        album.name,
      sets:        album.sets,
      tags:        normalizeData(stats.stats),
      tagsById:    stats.stats.map(x => x.id),
      current:     album.current,
      total:       album.total,
      cards:       nc,
      cardsById:   cardsIds,
      editMode:    false,
      resultCards: {},
      changes:     {},
      filterText:  ''
    };
  }
}
