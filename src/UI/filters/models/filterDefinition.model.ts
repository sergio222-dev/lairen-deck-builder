import type { Page, Sort } from '~/app/shared/domain/models/specification';
import { FilterType }      from '~/app/shared/domain/models/specification';

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

export interface UIFilterValues {
  label: string;
  value: string;
}

export interface UIFilterValuesList {
  'SET': UIFilterValues[];
  'TYPE': UIFilterValues[];
  'SUB_TYPE': UIFilterValues[];
  'SUPER_TYPE': UIFilterValues[];
}

export interface UIFilterDefinitionInfo {
  field: string[];
  type: FilterType;
  exclusive?: boolean;
  currentValues: UIFilterValues[];
}

export interface UIFilterDefinition extends UIFilterDefinitionInfo{
  id: CATEGORY_FILTERS;
  label: string;
  availableValues: UIFilterValues[];
}

export function generatePageFilter(pagination: Page): UIFilterDefinition {

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
