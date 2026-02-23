import type { CardFinder }        from '~/app/card/application/finder/card.finder';
import type { CardInfoProection } from '~/app/shared/application/projections/cardInfo.proection';
import { TOKENS }             from '~/app/shared/binds/TOKENS';
import type { Specification } from '~/app/shared/domain/models/specification';

export class FindCard {
  static readonly inject = [TOKENS.CARD_FINDER];

  constructor(private readonly finder: CardFinder) {
  }

  // TODO should refactor specification
  async execute(specs: Specification[], dominion = false): Promise<[CardInfoProection[], number]> {
    const [cards, total] = await this.finder.fetchCards(specs, dominion);

    return [cards, total ?? 0];
  }
}
