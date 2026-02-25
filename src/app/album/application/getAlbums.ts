import type { AlbumRepository } from '~/app/album/infrastructure/album.repository';
import { AuthService }          from '~/app/shared/application/auth.service';

import { TOKENS }            from '~/app/shared/binds/TOKENS';
import { UserIdValueObject } from '~/app/shared/domain/VO/userId.valueObject';

export class GetAlbums {
  static readonly inject = [TOKENS.ALBUM_REPOSITORY, TOKENS.AUTH_SERVICE];

  constructor(private albumRepository: AlbumRepository, private authService: AuthService) {
  }

  async execute(owner: string) {
    await this.authService.authenticate();
    const ownerId = new UserIdValueObject(owner);

    return await this.albumRepository.listByUserOwner(ownerId);
  }
}
