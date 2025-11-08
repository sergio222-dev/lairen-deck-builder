import type { CardRepository }    from '~/app/card/infrastructure/card.repository';
import { IlikeSpecification }     from '~/app/filter/filter/models/Specification';
import { TOKENS }                 from '~/app/shared/binds/TOKENS';
import type { StringValueObject } from '~/app/shared/models/VO/StringValueObject';

export class QueryCards {
  static readonly inject = [TOKENS.CARD_REPOSITORY];

  constructor(private readonly cardRepository: CardRepository) {
  }

  async execute(query: StringValueObject) {

    const inSpec = new IlikeSpecification(['name'], [query.value]);

    const r = await this.cardRepository.fetchCards([inSpec]);

    return r.cards;
  }
}
