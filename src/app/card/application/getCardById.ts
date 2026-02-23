import type CardRepository from '~/app/card/infrastructure/card.repository';
import { TOKENS }        from '~/app/shared/binds/TOKENS';
import { IdValueObject } from '~/app/shared/domain/VO/id.valueObject';

export class GetCardById {
  static readonly inject = [TOKENS.CARD_REPOSITORY];

  constructor(private cardRepository: CardRepository) {
  }

  async execute(cardId: number) {
    const cardIdVo = new IdValueObject(cardId);
    return await this.cardRepository.getById(cardIdVo);
  }
}
