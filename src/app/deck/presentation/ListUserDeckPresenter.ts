import type { ListUserDecks }          from '~/app/deck/application/listUserDecks';
import { TOKENS }                      from '~/app/shared/binds/TOKENS';
import type { UIBasicDeckInformation } from '~/UI/deck/models/deck.store.model';

export class ListUserDeckPresenter {
  static readonly inject = [TOKENS.LIST_USER_DECK];

  constructor(private listUserDecks: ListUserDecks) {
  }

  async execute(): Promise<UIBasicDeckInformation[]> {
    const decks = await this.listUserDecks.execute();

    return decks.map(d => {

      return {
        deckId: d.id.value,
        isPublic: d.isPublic,
        name: d.name.value,
        description: d.description?.value ?? null,
        splashArt: d.splashArt?.image.value,
        type1: d.type1?.value ?? null,
        type2: d.type2?.value ?? null,
      }
    })
  }
}
