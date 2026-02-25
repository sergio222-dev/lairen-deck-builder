import type { Deck }           from '~/app/deck/domain/models/deck.model';
import type { DeckRepository } from '~/app/deck/infrastructure/deck.repository';
import { AuthService }         from '~/app/shared/application/auth.service';
import { TOKENS }            from '~/app/shared/binds/TOKENS';
import { UserIdValueObject } from '~/app/shared/domain/VO/userId.valueObject';

export class ListUserDecks {
  static readonly inject = [TOKENS.DECK_REPOSITORY, TOKENS.AUTH_SERVICE];

  constructor(private readonly deckRepository: DeckRepository, private readonly authService: AuthService) {
  }

  async execute(userId: string): Promise<Deck[]> {
    await this.authService.authenticate();
    const ownerIdVo = new UserIdValueObject(userId);

    return await this.deckRepository.listUserDecks(ownerIdVo);
  }
}
