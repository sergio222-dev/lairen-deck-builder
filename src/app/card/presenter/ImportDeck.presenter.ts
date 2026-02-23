import type { GetAllCardAlbum } from '~/app/album/application/getAllCardAlbum';
import type { ImportDeckCards } from '~/app/card/application/importDeckCards';
import { User }                 from '~/app/shared/application/DTO/user.dto';
import { TOKENS }             from '~/app/shared/binds/TOKENS';
import { UserIdValueObject }  from '~/app/shared/domain/VO/userId.valueObject';
import { calculateDeckStats } from '~/app/shared/presenter/utils/calculateDeckStats';
import { UnauthorizedException } from '~/exceptions/UnauthorizedException';

import type { UIDeckCardInformation, UIDeckStats, UIUserCollection } from '~/UI/deck/models/deck.store.model';

export class ImportDeckPresenter {
  static readonly inject = [TOKENS.IMPORT_DECK, TOKENS.GET_ALL_CARD_ALBUM, TOKENS.CURRENT_USER];

  constructor(private readonly importDeck: ImportDeckCards, private readonly getAlbumCards: GetAllCardAlbum, private readonly getCurrentUser: () => User | null) {
  }

  async execute(text: string): Promise<UIDeckCardInformation & UIDeckStats & UIUserCollection> {

    const currentUser = this.getCurrentUser();

    if (!currentUser) {
      throw new UnauthorizedException(``)
    }

    const ownerIdVo = new UserIdValueObject(currentUser.id)
    const [cardInfo, cards] = await this.importDeck.execute(text);
    const albumCards        = await this.getAlbumCards.execute(ownerIdVo);

    const collection = albumCards.reduce((a, c) => {
      if (!a[c.id]) {
        a[c.id] = c.quantity;
      } else {
        a[c.id] += a.quantity;
      }

      return a;
    }, {} as Record<string, number>);

    return calculateDeckStats(cardInfo, cards, collection);
  }
}
