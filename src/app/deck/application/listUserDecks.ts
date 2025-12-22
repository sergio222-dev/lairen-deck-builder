import type { Deck }           from '~/app/deck/domain/models/deck.model';
import type { DeckRepository } from '~/app/deck/infrastructure/deck.repository';
import { TOKENS }              from '~/app/shared/binds/TOKENS';
import type { UserRepository } from '~/app/user/infrastructure/user.repository';

export class ListUserDecks {
  static readonly inject = [TOKENS.DECK_REPOSITORY, TOKENS.USER_REPOSITORY];

  constructor(private readonly deckRepository: DeckRepository, private readonly userRepository: UserRepository) {
  }

  async execute(): Promise<Deck[]> {
    const currentUser = await this.userRepository.getCurrentUser();
    return await this.deckRepository.listUserDecks(currentUser.id);
  }
}
