import type { CardRepository }                 from '~/app/card/infrastructure/card.repository';
import { IlikeSpecification, InSpecification } from '~/app/filter/filter/models/Specification';
import { TOKENS }                 from '~/app/shared/binds/TOKENS';
import type { StringValueObject } from '~/app/shared/domain/VO/StringValueObject';

export class QueryCards {
  static readonly inject = [TOKENS.CARD_REPOSITORY];

  constructor(private readonly cardRepository: CardRepository) {
  }

  async execute(query: StringValueObject, sets: StringValueObject[]) {

    const inSpec = new IlikeSpecification(['name'], [query.value]);
    const inSets = new InSpecification(['set'], sets.map(s => s.value))

    const r = await this.cardRepository.fetchCards([inSpec, inSets]);

    return r.cards;
  }
}
