import type { AlbumCardProjection } from '~/app/album/application/projection/albumCard.projection';
import type { UserIdValueObject }   from '~/app/shared/domain/VO/userId.valueObject';

export interface AlbumFinder {
  getAllCardsInfoProjection(ownerId: UserIdValueObject): Promise<AlbumCardProjection[]>;
}
