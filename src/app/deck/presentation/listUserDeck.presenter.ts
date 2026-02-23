import type { ListUserDecks }          from '~/app/deck/application/listUserDecks';
import type { User }                   from '~/app/shared/application/DTO/user.dto';
import { TOKENS }                      from '~/app/shared/binds/TOKENS';
import type { UIBasicDeckInformation } from '~/UI/deck/models/deck.store.model';

export class ListUserDeckPresenter {
  static readonly inject = [TOKENS.LIST_USER_DECK, TOKENS.CURRENT_USER];

  constructor(private listUserDecks: ListUserDecks, private currentUser: () => User | null) {
  }

  async execute(): Promise<UIBasicDeckInformation[]> {
    const currentUser = this.currentUser();

    if (!currentUser) {
      return [];
    }

    const decks = await this.listUserDecks.execute(currentUser.id);

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
