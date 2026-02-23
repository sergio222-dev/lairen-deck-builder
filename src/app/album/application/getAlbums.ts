import type { AlbumRepository } from '~/app/album/infrastructure/album.repository';

import { TOKENS }            from '~/app/shared/binds/TOKENS';
import { UserIdValueObject } from '~/app/shared/domain/VO/userId.valueObject';

export class GetAlbums {
  static readonly inject = [TOKENS.ALBUM_REPOSITORY];

  constructor(private albumRepository: AlbumRepository) {
  }

  async execute(owner: string) {
    const ownerId = new UserIdValueObject(owner);
    return await this.albumRepository.listByUserOwner(ownerId);
  }
}
