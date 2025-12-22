import type { AlbumFinder } from '~/app/album/application/finder/albumFinder';
import type { AlbumCardProjection } from '~/app/album/application/projection/AlbumCardProjection';
import { TOKENS }           from '~/app/shared/binds/TOKENS';

export class GetAllCardAlbum {
  static readonly inject = [TOKENS.ALBUM_FINDER];

  constructor(private readonly finder: AlbumFinder) {
  }

  async execute(): Promise<AlbumCardProjection[]> {
    return await this.finder.getAllCardsInfoProjection();
  }
}
