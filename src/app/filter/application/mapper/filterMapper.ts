import type { Specification }    from '~/app/filter/filter/models/Specification';
import {
  FilterType,
  IlikeSpecification,
  InSpecification,
  OrderFilter,
  RangeFilter
}                                from '~/app/filter/filter/models/Specification';
import { Logger }                from '~/lib/logger';
import type { FilterDefinition } from '~/UI/filters/models/filterDefinition.model';

export function mapFilterToSpecification(filterGroups: FilterDefinition[]): Specification[] {

  const filters: Specification[] = [];

  filterGroups.forEach(f => {

    switch (f.type) {

      case FilterType.RANGE:
        const rangeFilter = new RangeFilter(parseInt(f.currentValues[0].value), parseInt(f.currentValues[1].value));
        filters.push(rangeFilter);
        break;

      case FilterType.ORDER:
        const orderFilter = new OrderFilter(f.field[0], f.currentValues[0].value as 'asc' | 'desc');
        filters.push(orderFilter);
        break;

      case FilterType.IN:
        const inFilter = new InSpecification(f.field, f.currentValues.map(v => v.value), f.exclusive);
        filters.push(inFilter);
        break;

      case FilterType.ILIKE:
        const iLikeFilter = new IlikeSpecification(f.field, f.currentValues.map(v => v.value), f.exclusive);
        filters.push(iLikeFilter);
        break;
    }

  });

  return filters;
}
