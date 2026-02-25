import type { AlbumCardProjection } from '~/app/album/application/projection/albumCard.projection';
import { IdValueObject }            from '~/app/shared/domain/VO/id.valueObject';
import type { UserIdValueObject }   from '~/app/shared/domain/VO/userId.valueObject';

export interface AlbumFinder {
  getAllCardsInfoProjection(ownerId: UserIdValueObject): Promise<AlbumCardProjection[]>;
  findMissingCardInfoProjection(ownerId: UserIdValueObject, albumId: IdValueObject): Promise<AlbumCardProjection[]>;
}
