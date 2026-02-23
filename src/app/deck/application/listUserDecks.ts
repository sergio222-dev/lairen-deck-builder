import type { Deck }           from '~/app/deck/domain/models/deck.model';
import type { DeckRepository } from '~/app/deck/infrastructure/deck.repository';
import { TOKENS }            from '~/app/shared/binds/TOKENS';
import { UserIdValueObject } from '~/app/shared/domain/VO/userId.valueObject';

export class ListUserDecks {
  static readonly inject = [TOKENS.DECK_REPOSITORY];

  constructor(private readonly deckRepository: DeckRepository) {
  }

  async execute(userId: string): Promise<Deck[]> {
    const ownerIdVo = new UserIdValueObject(userId);

    return await this.deckRepository.listUserDecks(ownerIdVo);
  }
}
