import type { QRL }                                from '@builder.io/qwik';
import type { Page, Sort }                         from '~/app/filter/filter/models/Specification';
import type { CATEGORY_FILTERS, FilterDefinition } from '~/UI/filters/models/filterDefinition.model';
import type { CardStackItem }                      from '~/UI/shared/models/CardSackItem';
import type { NormalizedModel }                    from '~/utils/normalize';

interface FilterInfo {
  filterGroups: NormalizedModel<FilterDefinition>;
  pagination: Page;
  sortBy: Sort;
  count: number;
}

export interface FilterStoreState extends FilterInfo {
  quantityRarityFilters: number;
  quantityTextFilters: number;
  quantitySetFilters: number;
  quantitySubTypeFilters: number;
  quantityTypeFilters: number;
  quantitySuperTypeFilters: number;
  quantityCostFilters: number;

  textFilters: string[];
  rarityFilters: string[];
  setFilters: string[];
  subTypeFilters: string[];
  typeFilters: string[];
  superTypeFilters: string[];
  costFilters: string[];

  cardStack: NormalizedModel<CardStackItem>;
  cards: number[];
}

export type FILTER_STORE = FilterStoreState & FilterStoreAction;

export interface FilterStoreAction {
  addFilter: QRL<(this: FILTER_STORE, id: CATEGORY_FILTERS, value: string, label?: string) => void>;
  removeFilter: QRL<(this: FILTER_STORE, id: CATEGORY_FILTERS, value: string) => void>;
  setPage: QRL<(this: FILTER_STORE, page: number) => void>;
  toggleExclusive: QRL<(this: FILTER_STORE, id: CATEGORY_FILTERS) => void>;
  fetchCards: QRL<(this: FILTER_STORE) => Promise<void>>;
}

