import type { GetAllCardAlbum } from '~/app/album/application/getAllCardAlbum';
import type { ImportDeckCards } from '~/app/card/application/importDeckCards';
import { TOKENS }               from '~/app/shared/binds/TOKENS';
import { calculateDeckStats }   from '~/app/shared/presenter/utils/calculateDeckStats';

import type { UIDeckCardInformation, UIDeckStats, UIUserCollection } from '~/UI/deck/models/deck.store.model';

export class ImportDeckPresenter {
  static readonly inject = [TOKENS.IMPORT_DECK, TOKENS.GET_ALL_CARD_ALBUM];

  constructor(private readonly importDeck: ImportDeckCards, private readonly getAlbumCards: GetAllCardAlbum) {
  }

  async execute(text: string): Promise<UIDeckCardInformation & UIDeckStats & UIUserCollection> {
    const [cardInfo, cards] = await this.importDeck.execute(text);
    const albumCards        = await this.getAlbumCards.execute();

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
