import type { AddCardToAlbum } from '~/app/album/application/addCardToAlbum';
import { TOKENS }              from '~/app/shared/binds/TOKENS';

export class AddCardToAlbumPresenter {
  static readonly inject = [TOKENS.ADD_CARD_TO_ALBUM];

  constructor(private addCardToAlbum: AddCardToAlbum) {
  }

  async execute(idAlbum: number, idCard: number) {
    await this.addCardToAlbum.execute({
      idAlbum,
      idCard
    });
  }
}
