import type { AlbumRepository } from '~/app/album/infrastructure/album.repository';
import type { Album }           from '~/app/album/models/album.model';

import { TOKENS } from '~/app/shared/binds/TOKENS';

export class CreateAlbum {

  public static inject = [TOKENS.ALBUM_REPOSITORY] as const;

  constructor(private readonly albumRepository: AlbumRepository) {
  }

  async execute(album: Album) {
    return await this.albumRepository.saveAlbum(album);
  }
}
