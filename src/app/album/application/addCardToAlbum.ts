import type { AlbumRepository }   from '~/app/album/infrastructure/album.repository';
import type { IdCardValueObject } from '~/app/card/models/VO/IdCard.ValueObject';
import { TOKENS }             from '~/app/shared/binds/TOKENS';
import type { IdValueObject } from '~/app/shared/domain/VO/Id.ValueObject';

export class AddCardToAlbum {
  static readonly inject = [TOKENS.ALBUM_REPOSITORY];

  constructor(private albumRepository: AlbumRepository) {
  }

  async execute(idAlbum: IdValueObject, idCard: IdCardValueObject) {
    const album = await this.albumRepository.getAlbumById(idAlbum);

    album.attachCard(idCard)

    await this.albumRepository.saveAlbum(album);
  }

}
