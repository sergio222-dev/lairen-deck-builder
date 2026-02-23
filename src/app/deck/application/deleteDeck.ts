import type { DeckRepository } from '~/app/deck/infrastructure/deck.repository';
import { TOKENS }              from '~/app/shared/binds/TOKENS';
import { IdValueObject }       from '~/app/shared/domain/VO/id.valueObject';
import { Logger }              from '~/lib/logger';

export class DeleteDeck {
  static inject = [TOKENS.DECK_REPOSITORY];

  constructor(private readonly deckRepository: DeckRepository) {
  }

  async execute(deckId: number): Promise<void> {
    const deckIdVo = new IdValueObject(deckId);
    try {

      await this.deckRepository.deleteDeck(deckIdVo);
    } catch (error) {
      Logger.error(error);
    }
  }
}
