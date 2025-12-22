import type { SaveAlbumChangesCommand } from '~/app/album/application/DTO/SaveAlbumChanges.command';
import { AlbumChangeValueObject }       from '~/app/album/domain/VO/AlbumChange.ValueObject';
import type { AlbumRepository }         from '~/app/album/infrastructure/album.repository';

import { TOKENS }        from '~/app/shared/binds/TOKENS';
import { IdValueObject } from '~/app/shared/domain/VO/Id.ValueObject';

export class SaveAlbumChanges {
  static readonly inject = [TOKENS.ALBUM_REPOSITORY] as const;

  constructor(private readonly albumRepository: AlbumRepository) {
  }

  async execute(command: SaveAlbumChangesCommand): Promise<void> {
    const albumId = new IdValueObject(command.albumId);
    const changes = command.changes.map(c => new AlbumChangeValueObject(c.cardId, c.tagId, c.amount));

    const album = await this.albumRepository.getAlbumById(albumId);

    changes.forEach(c => {
      album.addChange(c);
    });

    await this.albumRepository.saveAlbum(album);
  }
}
