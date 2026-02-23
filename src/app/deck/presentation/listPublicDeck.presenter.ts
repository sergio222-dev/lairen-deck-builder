import type { ListPublicDecks } from '~/app/deck/application/listPublicDecks';
import { TOKENS }               from '~/app/shared/binds/TOKENS';

import type { UIBasicDeckInformation } from '~/UI/deck/models/deck.store.model';

export class ListPublicDeckPresenter {
  static readonly inject = [TOKENS.LIST_PUBLIC_DECK];

  constructor(private readonly listPublicDeck: ListPublicDecks) {
  }

  async execute(): Promise<UIBasicDeckInformation[]> {
    const decks = await this.listPublicDeck.execute();

    return decks.map(d => {

      return {
        deckId:      d.id.value,
        isPublic:    d.isPublic,
        name:        d.name.value,
        description: d.description?.value ?? null,
        splashArt:   d.splashArt?.image.value,
        type1:       d.type1?.value ?? null,
        type2:       d.type2?.value ?? null
      };
    });
  }
}
