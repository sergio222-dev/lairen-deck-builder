import type { QRL }                                  from '@builder.io/qwik';
import type { Page, Sort }                           from '~/app/shared/domain/models/specification';
import type { CATEGORY_FILTERS, UIFilterDefinition } from '~/UI/filters/models/filterDefinition.model';
import type { UICardStackItem }                      from '~/UI/shared/models/CardStackItem';
import type { NormalizedModel }                      from '~/utils/normalize';

export interface UIFilterContent {

}

interface FilterInfo {
  filterGroups: NormalizedModel<UIFilterDefinition>;
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

  cardStack: NormalizedModel<UICardStackItem>;
  cards: number[];

  dominion: boolean;
}

export type FILTER_STORE = FilterStoreState & FilterStoreAction;

export interface FilterStoreAction {
  addFilter: QRL<(this: FILTER_STORE, id: CATEGORY_FILTERS, value: string, label?: string) => void>;
  removeFilter: QRL<(this: FILTER_STORE, id: CATEGORY_FILTERS, value: string) => void>;
  setPage: QRL<(this: FILTER_STORE, page: number) => void>;
  toggleExclusive: QRL<(this: FILTER_STORE, id: CATEGORY_FILTERS) => void>;
  toggleDominion: QRL<(this: FILTER_STORE) => void>;
  fetchCards: QRL<(this: FILTER_STORE) => Promise<void>>;
}

