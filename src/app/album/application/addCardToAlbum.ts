import type { AddCardToAlbumCommand } from '~/app/album/application/DTO/AddCardToAlbum.command';
import type { AlbumRepository }       from '~/app/album/infrastructure/album.repository';
import { TOKENS }                     from '~/app/shared/binds/TOKENS';
import { IdValueObject }              from '~/app/shared/domain/VO/Id.ValueObject';

export class AddCardToAlbum {
  static readonly inject = [TOKENS.ALBUM_REPOSITORY];

  constructor(private albumRepository: AlbumRepository) {
  }

  async execute(command: AddCardToAlbumCommand): Promise<void> {
    const idAlbum = new IdValueObject(command.idAlbum);
    const idCard = new IdValueObject(command.idCard);

    const album   = await this.albumRepository.getAlbumById(idAlbum);

    album.attachCard(idCard);

    await this.albumRepository.saveAlbum(album);
  }

}
