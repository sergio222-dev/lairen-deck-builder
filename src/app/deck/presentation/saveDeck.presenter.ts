import type { CreateDeck }        from '~/app/deck/application/createDeck';
import type { UpdateDeckCommand } from '~/app/deck/application/DTO/updateDeck.command';
import type { UpdateDeck }        from '~/app/deck/application/updateDeck';

import { TOKENS }                                        from '~/app/shared/binds/TOKENS';
import type { UIBasicDeckInformation, UICardInDeckItem } from '~/UI/deck/models/deck.store.model';

export class SaveDeckPresenter {
  static readonly inject = [TOKENS.CREATE_DECK, TOKENS.UPDATE_DECK];

  constructor(private readonly createDeck: CreateDeck, private readonly updateDeck: UpdateDeck) {
  }

  async execute(data: UIBasicDeckInformation, cards: UICardInDeckItem[]): Promise<number> {

    const command: UpdateDeckCommand = {
      id:          data.deckId,
      name:        data.name,
      description: data.description,
      isPublic:    data.isPublic,
      type1:       data.type1,
      type2:       data.type2,
      splashArtId: data.splashArtId ?? null,
      cards:       cards.map(c => ({
        cardId:       c.id,
        quantitySide: c.quantityInSide,
        quantity:     c.quantity
      }))
    };

    if (data.deckId > 0) {
      return await this.updateDeck.execute(command);
    }

    return await this.createDeck.execute(command);
  }
}
