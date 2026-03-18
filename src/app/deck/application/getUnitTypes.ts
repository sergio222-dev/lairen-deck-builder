import { CardTypesFinder } from '~/app/deck/application/finder/cardTypes.finder';
import { TOKENS }          from '~/app/shared/binds/TOKENS';

export class GetUnitTypes {
  static readonly inject = [TOKENS.CARD_TYPES_FINDER];

  constructor(private readonly finder: CardTypesFinder) {
  }

  async execute() {
    return await this.finder.findAllUnitTypes();
  }

}
