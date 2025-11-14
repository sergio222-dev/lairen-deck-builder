import type { AlbumRepository } from '~/app/album/infrastructure/album.repository';
import type { Album }           from '~/app/album/domain/models/album.model';
import type { CardRepository }  from '~/app/card/infrastructure/card.repository';
import type { Card }            from '~/app/card/models/card.model';
import { TOKENS }             from '~/app/shared/binds/TOKENS';
import type { IdValueObject } from '~/app/shared/domain/VO/Id.ValueObject';

export class GetAlbum {
  static readonly inject = [TOKENS.ALBUM_REPOSITORY, TOKENS.CARD_REPOSITORY];

  constructor(private albumRepository: AlbumRepository, private cardRepository: CardRepository) {
  }

  async execute(albumId: IdValueObject): Promise<[Album, Card[]]> {
    const album = await this.albumRepository.getAlbumById(albumId);
    const cards = await this.cardRepository.getCardsByAlbumId(albumId);

    return [album, cards];
  }
}
