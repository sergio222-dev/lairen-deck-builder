import type { CardRepository } from '~/app/card/infrastructure/card.repository';
import { TOKENS }              from '~/app/shared/binds/TOKENS';

export class GetOwnedCards {
  static readonly inject = [TOKENS.CARD_REPOSITORY];

  constructor(private readonly cardRepository: CardRepository) {
  }

  async execute() {
    return await this.cardRepository.getOwnedCards();
  }
}
