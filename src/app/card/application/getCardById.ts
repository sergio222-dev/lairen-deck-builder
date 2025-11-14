import type { CardRepository } from '~/app/card/infrastructure/card.repository';
import { TOKENS }             from '~/app/shared/binds/TOKENS';
import type { IdValueObject } from '~/app/shared/domain/VO/Id.ValueObject';

export class GetCardById {
  static readonly inject = [TOKENS.CARD_REPOSITORY];

  constructor(private cardRepository: CardRepository) {
  }

  async execute(cardId: IdValueObject) {
    return await this.cardRepository.getById(cardId);
  }
}
