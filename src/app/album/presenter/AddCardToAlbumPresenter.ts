import type { AddCardToAlbum } from '~/app/album/application/addCardToAlbum';
import { TOKENS }        from '~/app/shared/binds/TOKENS';
import { IdValueObject } from '~/app/shared/domain/VO/Id.ValueObject';

export class AddCardToAlbumPresenter {
  static readonly inject = [TOKENS.ADD_CARD_TO_ALBUM];

  constructor(private addCardToAlbum: AddCardToAlbum) {
  }

  async execute(idAlbum: number, idCard: number) {
    await this.addCardToAlbum.execute(new IdValueObject(idAlbum), new IdValueObject(idCard));
  }
}
