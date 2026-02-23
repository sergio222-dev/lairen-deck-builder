import type { AlbumRepository } from '~/app/album/infrastructure/album.repository';
import { TOKENS }        from '~/app/shared/binds/TOKENS';
import { IdValueObject } from '~/app/shared/domain/VO/id.valueObject';

export class DeleteAlbum {
  static readonly inject = [TOKENS.ALBUM_REPOSITORY];

  constructor(private albumRepository: AlbumRepository) {
  }

  async execute(albumId: number): Promise<void> {
    const albumIdVo = new IdValueObject(albumId);
    await this.albumRepository.deleteAlbumById(albumIdVo);
  }
}
