import type { FindCard }      from '~/app/card/application/findCard';
import { TOKENS }             from '~/app/shared/binds/TOKENS';
import type { Specification } from '~/app/shared/domain/models/specification';
import {
  FilterType,
  IlikeSpecification,
  InSpecification,
  OrderFilter,
  RangeFilter
}                             from '~/app/shared/domain/models/specification';

import type { UIFilterDefinitionInfo } from '~/UI/filters/models/filterDefinition.model';
import type { UICardStackItem }        from '~/UI/shared/models/CardStackItem';

export class FindCardByFiltersPresenter {
  static readonly inject = [TOKENS.FIND_CARDS];

  constructor(private readonly findCard: FindCard) {
  }

  async execute(filters: UIFilterDefinitionInfo[], dominion = false): Promise<[UICardStackItem[], number]> {

    // map to Specification
    const specs: Specification[] = [];

    filters.forEach(filter => {
      const values = filter.currentValues.map(x => x.value);

      switch (filter.type) {
        case FilterType.ILIKE:
          specs.push(new IlikeSpecification(filter.field, values, filter.exclusive));
          break;
        case FilterType.IN:
          specs.push(new InSpecification(filter.field, values, filter.exclusive));
          break;
        case FilterType.ORDER:
          specs.push(new OrderFilter(filter.field[0], values[0] as 'asc' | 'desc'));
          break;
        case FilterType.RANGE:
          specs.push(new RangeFilter(parseInt(values[0]), parseInt(values[1])));
          break;
      }
    });

    return await this.findCard.execute(specs, dominion);
  }
}
