import type { Page, Sort } from '~/app/filter/filter/models/Specification';
import { FilterType }      from '~/app/filter/filter/models/Specification';

export const DEFAULT_PAGE_SIZE = 24;

export const DEFAULT_SORT: Sort       = {
  direction: 'asc',
  field:     'name'
};
export const DEFAULT_PAGINATION: Page = {
  page: 1,
  size: DEFAULT_PAGE_SIZE,
  pages: 0,
};

export enum CATEGORY_FILTERS {
  TEXT,
  RARITY,
  PAGINATION,
  SORT,
  COST,
  SET,
  TYPE,
  SUB_TYPE,
  SUPER_TYPE,
}

export interface FilterValues {
  label: string;
  value: string;
}

export interface FilterDefinition {
  label: string;
  id: CATEGORY_FILTERS;
  field: string[];
  type: FilterType;
  exclusive?: boolean;
  availableValues: FilterValues[];
  currentValues: FilterValues[];
}

export function generatePageFilter(pagination: Page): FilterDefinition {

  const from = pagination.page - 1 <= 0 ? 0 : (pagination.page - 1) * pagination.size;
  const to   = from + pagination.size;

  return {
    id:              CATEGORY_FILTERS.PAGINATION,
    field:           [],
    label:           'Pagination',
    type:            FilterType.RANGE,
    availableValues: [],
    currentValues:   [
      {
        value: from.toString(),
        label: from.toString()
      },
      {
        value: to.toString(),
        label: to.toString()
      }
    ]
  };
}
