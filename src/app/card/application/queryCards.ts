import type CardRepository                     from '~/app/card/infrastructure/card.repository';
import { TOKENS }                              from '~/app/shared/binds/TOKENS';
import { IlikeSpecification, InSpecification } from '~/app/shared/domain/models/specification';

export class QueryCards {
  static readonly inject = [TOKENS.CARD_REPOSITORY];

  constructor(private readonly cardRepository: CardRepository) {
  }

  async execute(query: string, sets: string[]) {

    const inSpec = new IlikeSpecification(['name'], [query]);
    const inSets = new InSpecification(['set'], sets);

    const r = await this.cardRepository.fetchCards([inSpec, inSets]);

    return r.cards;
  }
}
