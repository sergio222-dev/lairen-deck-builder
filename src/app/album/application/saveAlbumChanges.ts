import type { AlbumRepository }        from '~/app/album/infrastructure/album.repository';
import type { AlbumChangeValueObject } from '~/app/album/domain/VO/AlbumChange.ValueObject';
import { TOKENS }             from '~/app/shared/binds/TOKENS';
import type { IdValueObject } from '~/app/shared/domain/VO/Id.ValueObject';

export class SaveAlbumChanges {
  static readonly inject = [TOKENS.ALBUM_REPOSITORY];

  constructor(private albumRepository: AlbumRepository) {
  }

  async execute(albumId: IdValueObject, changes: AlbumChangeValueObject[]) {
    const a = await this.albumRepository.getAlbumById(albumId);

    changes.forEach(c => {
      a.addChange(c);
    })

    await this.albumRepository.saveAlbum(a);
  }
}
