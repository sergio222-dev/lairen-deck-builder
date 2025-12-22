import type { DeckRepository } from '~/app/deck/infrastructure/deck.repository';
import { TOKENS }              from '~/app/shared/binds/TOKENS';

export class ListPublicDecks {
  static readonly inject = [TOKENS.DECK_REPOSITORY];

  constructor(private readonly deckRepository: DeckRepository) {
  }

  async execute() {
    return await this.deckRepository.listPublicDeck();
  }
}
