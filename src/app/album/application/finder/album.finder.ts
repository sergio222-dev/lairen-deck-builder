import { AlbumProjection }               from '~/app/album/application/projection/album.projection';
import type { AlbumCardProjection }      from '~/app/album/application/projection/albumCard.projection';
import { AlbumCardWithCursorProjection } from '~/app/album/application/projection/albumCardWithTags.projection';
import { AlbumStatsProjection }          from '~/app/album/application/projection/albumStats.projection';
import { IdValueObject }                 from '~/app/shared/domain/VO/id.valueObject';
import { StringValueObject }             from '~/app/shared/domain/VO/string.valueObject';
import type { UserIdValueObject }        from '~/app/shared/domain/VO/userId.valueObject';

export interface AlbumFinder {
  getAllCardsInfoProjection(ownerId: UserIdValueObject): Promise<AlbumCardProjection[]>;

  findMissingCardInfoProjection(ownerId: UserIdValueObject, albumId: IdValueObject): Promise<AlbumCardProjection[]>;

  findAlbumCardProjection(albumId: IdValueObject, query: StringValueObject, cursor: StringValueObject | null): Promise<AlbumCardWithCursorProjection>;

  findAlbumProjection(ownerId: UserIdValueObject, albumId: IdValueObject): Promise<AlbumProjection>;

  getAlbumStats(albumId: IdValueObject): Promise<AlbumStatsProjection>;
}
