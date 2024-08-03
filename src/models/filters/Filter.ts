export const FILTERS_TYPES = {
  LIKE: 'LIKE',
  IN:   'IN',
}

export interface Filter {
  id: string;
  label: string;
  value: string;
  field: string;
  filterType: typeof FILTERS_TYPES[keyof typeof FILTERS_TYPES];
  isDisjunctive?: boolean;
}

export function convertToFilter(filter: Filter): [string, string, string] {
  switch (filter.filterType) {
    case FILTERS_TYPES.LIKE:
      return [filter.field, 'ilike', '%' + filter.value + '%'];
    case FILTERS_TYPES.IN:
      return [filter.field, 'in', `(${filter.value})`];
    default:
      throw new Error('Filter type not found');
  }
}
