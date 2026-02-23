import type { AlbumFinder }         from '~/app/album/application/finder/album.finder';
import type { AlbumCardProjection } from '~/app/album/application/projection/albumCard.projection';
import { TOKENS }                 from '~/app/shared/binds/TOKENS';
import type { UserIdValueObject } from '~/app/shared/domain/VO/userId.valueObject';

export class GetAllCardAlbum {
  static readonly inject = [TOKENS.ALBUM_FINDER];

  constructor(private readonly finder: AlbumFinder) {
  }

  async execute(ownerId: UserIdValueObject): Promise<AlbumCardProjection[]> {
    return await this.finder.getAllCardsInfoProjection(ownerId);
  }
}
