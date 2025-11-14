import type { AlbumRepository } from '~/app/album/infrastructure/album.repository';

import { TOKENS }                 from '~/app/shared/binds/TOKENS';
import type { UserIdValueObject } from '~/app/shared/domain/VO/UserId.ValueObject';

export class GetAlbums {
  static readonly inject = [TOKENS.ALBUM_REPOSITORY];

  constructor(private albumRepository: AlbumRepository) {
  }

  async execute(owner: UserIdValueObject) {
    return await this.albumRepository.listByUserOwnerShallow(owner);
  }
}
