import type { Album }           from '~/app/album/domain/models/album.model';
import type { AlbumRepository } from '~/app/album/infrastructure/album.repository';

import type { Card }           from '~/app/card/domain/models/card.model';
import type { CardRepository } from '~/app/card/infrastructure/card.repository';

import { TOKENS }        from '~/app/shared/binds/TOKENS';
import { IdValueObject } from '~/app/shared/domain/VO/Id.ValueObject';

export class GetAlbum {
  static readonly inject = [TOKENS.ALBUM_REPOSITORY, TOKENS.CARD_REPOSITORY];

  constructor(private albumRepository: AlbumRepository, private cardRepository: CardRepository) {
  }

  async execute(albumId: number): Promise<[Album, Card[]]> {
    const albumIdVo = new IdValueObject(albumId);
    const album     = await this.albumRepository.getAlbumById(albumIdVo);
    const cards     = await this.cardRepository.getCardsByAlbumId(albumIdVo);

    return [album, cards];
  }
}
