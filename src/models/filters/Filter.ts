export const FILTERS_TYPES = {
  LIKE:     'LIKE',
  IN:       'in',
  CONTAINS: 'CONTAINS',
}

export interface Filter {
  id: string;
  label: string;
  value: string;
  field: string | string[];
  filterType: typeof FILTERS_TYPES[keyof typeof FILTERS_TYPES];
  isContains?: boolean;
}

export function convertFiltersToExpression(filters: Filter[]): Array<string> {
  const fieldValueMap: Record<string, { fields: Set<string>, values: Set<string> }> = {};

  // Aggregating values for each field
  filters.forEach(filter => {
    const { field, value } = filter;

    const values           = value.split(','); // Assuming values are comma-separated

    if (Array.isArray(field)) {
      const fieldArray = field.join('-');
      if (!fieldValueMap[fieldArray]) {
        fieldValueMap[fieldArray] = {
          fields: new Set(),
          values: new Set(),
        }
      }
      values.forEach(v => fieldValueMap[fieldArray].values.add(v));
      field.forEach(f => fieldValueMap[fieldArray].fields.add(f));
    } else {
      if (!fieldValueMap[field]) {
        fieldValueMap[field] = {
          fields: new Set(),
          values: new Set(),
        };
      }
      values.forEach(v => fieldValueMap[field].values.add(v));
      fieldValueMap[field].fields.add(field);
    }
  });

  // Generating expressions
  const result: Array<string> = [];

  Object.keys(fieldValueMap).forEach(k => {
    const mergedValues = Array.from(fieldValueMap[k].values).join(',');
    const fields = Array.from(fieldValueMap[k].fields);
    const expression = fields.map(f => `${f}.${FILTERS_TYPES.IN}.(${mergedValues})`).join(',');
    result.push(expression);
  });

  console.log(result);

  return result;
}

export function convertToFilter(filter: Filter): [string, string, string] {
  switch (filter.filterType) {
    case FILTERS_TYPES.LIKE:
      if (Array.isArray(filter.field)) {
        return [filter.field.join('-'), 'ilike', '%' + filter.value + '%'];
      }
      return [filter.field, 'ilike', '%' + filter.value + '%'];
    case FILTERS_TYPES.IN:
      if (Array.isArray(filter.field)) {
        return [filter.field.join('-'), 'in', `${filter.value}`];
      }
      return [filter.field, 'in', `${filter.value}`];
    case FILTERS_TYPES.CONTAINS:
      if (Array.isArray(filter.field)) {
        return [filter.field.join('-'), 'ilike', `%${filter.value}%`];
      }
      return [filter.field, 'ilike', '%' + filter.value + '%'];
    default:
      throw new Error('Filter type not found');
  }
}
