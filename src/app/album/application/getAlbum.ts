import type { AlbumRepository } from '~/app/album/infrastructure/album.repository';
import type { Album }           from '~/app/album/models/album.model';
import { TOKENS }               from '~/app/shared/binds/TOKENS';
import type { IdValueObject }   from '~/app/shared/models/VO/Id.ValueObject';

export class GetAlbum {
  static readonly inject = [TOKENS.ALBUM_REPOSITORY];

  constructor(private albumRepository: AlbumRepository) {
  }

  async execute(albumId: IdValueObject): Promise<Album> {
    return await this.albumRepository.getAlbumById(albumId);
  }
}
