import { AlbumFinder }                   from '~/app/album/application/finder/album.finder';
import { AlbumCardWithCursorProjection } from '~/app/album/application/projection/albumCardWithTags.projection';
import { AuthService }                   from '~/app/shared/application/auth.service';
import { TOKENS }                        from '~/app/shared/binds/TOKENS';
import { IdValueObject }                 from '~/app/shared/domain/VO/id.valueObject';
import { StringValueObject }             from '~/app/shared/domain/VO/string.valueObject';

export class GetNextAlbumCards {
  static inject = [TOKENS.ALBUM_FINDER, TOKENS.AUTH_SERVICE];

  constructor(
    private readonly albumFinder: AlbumFinder,
    private readonly autService: AuthService
  ) {
  }

  async execute(albumId: number,query: string, cursor: string | null = null): Promise<AlbumCardWithCursorProjection> {
    await this.autService.authenticate();

    const albumIdVo = new IdValueObject(albumId);
    const queryVo = new StringValueObject(query);
    return await this.albumFinder.findAlbumCardProjection(albumIdVo, queryVo, cursor ? new StringValueObject(cursor) : null);
  }
}
