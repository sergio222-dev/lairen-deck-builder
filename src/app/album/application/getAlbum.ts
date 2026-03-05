import { AlbumFinder }     from '~/app/album/application/finder/album.finder';
import { AlbumProjection } from '~/app/album/application/projection/album.projection';
import { AuthService }     from '~/app/shared/application/auth.service';

import { TOKENS }            from '~/app/shared/binds/TOKENS';
import { IdValueObject }     from '~/app/shared/domain/VO/id.valueObject';
import { UserIdValueObject } from '~/app/shared/domain/VO/userId.valueObject';

export class GetAlbum {
  static readonly inject = [TOKENS.ALBUM_FINDER, TOKENS.AUTH_SERVICE];

  constructor(private readonly albumFinder: AlbumFinder,
              private readonly authService: AuthService
  ) {
  }

  async execute(albumId: number): Promise<AlbumProjection> {
    const user      = await this.authService.authenticate();
    const albumIdVo = new IdValueObject(albumId);

    return await this.albumFinder.findAlbumProjection(new UserIdValueObject(user.id), albumIdVo);
  }
}
