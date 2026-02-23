import type { CardFilterOptionsFinder } from '~/app/card/application/finder/cardFilterOptions.finder';
import { CardFilterOptions }            from '~/app/card/application/finder/cardFilterOptions.finder';
import type { FiltersOptions }          from '~/app/card/application/projections/filtersOptions';
import { TOKENS }                       from '~/app/shared/binds/TOKENS';

export class GetCardFilterOptions {
  static readonly inject = [TOKENS.CARD_FILTER_OPTIONS_FINDER];

  constructor(private readonly filterOptionsFinder: CardFilterOptionsFinder) {
  }

  async execute(filter: CardFilterOptions): Promise<FiltersOptions[]> {
    switch (filter) {
      case CardFilterOptions.SETS:
        return this.filterOptionsFinder.getSets();
      case CardFilterOptions.SUBTYPES:
        return this.filterOptionsFinder.getSubType();
      case CardFilterOptions.SUPERTYPES:
        return this.filterOptionsFinder.getSuperType();
      case CardFilterOptions.TYPES:
        return this.filterOptionsFinder.getTypes();
    }
  }
}
