import type { QRL }               from '@builder.io/qwik';
import { $, useStore }            from '@builder.io/qwik';
import { createContextId }        from '@builder.io/qwik';
import { serverFetchCards }       from '~/features/cards/server/fetchCards';
import type { Card }              from '~/models/Card';
import type { Filter }            from "~/models/filters/Filter";
import type { FetchCardsPayload } from "~/models/infrastructure/FetchCardsPayload";

export interface FilterContextState {
  sortBy: string;
  filters: Filter[];
  sortDirection: 'asc' | 'desc';
  page: number;
  size: number;
  cards: Card[],
  count: number,
  addFilter: QRL<(this: FilterContextState, filter: Filter) => Promise<void>>;
  removeFilter: QRL<(this: FilterContextState, id: string) => Promise<void>>;
  setPage: QRL<(this: FilterContextState, page: number) => Promise<void>>;
  setSize: QRL<(this: FilterContextState, size: number) => Promise<void>>;
}

export const useFilterStore = (cards: Card[] = [], count = 0, size = 20) => {
  return useStore<FilterContextState>({
    cards,
    count,
    sortBy:        'name',
    sortDirection: 'asc',
    page:          1,
    size,
    filters:       [],
    setPage:       $(async function (this, page) {
      this.page                        = page;
      const payload: FetchCardsPayload = {
        page,
        size:          this.size,
        sortBy:        this.sortBy,
        sortDirection: this.sortDirection,
        filters:       this.filters
      };

      const { cards, count } = await serverFetchCards(payload);

      this.cards = cards;
      this.count = count;
    }),
    setSize:       $(async function (this, size) {
      this.size                        = size;
      const payload: FetchCardsPayload = {
        page:          this.page,
        size,
        sortBy:        this.sortBy,
        sortDirection: this.sortDirection,
        filters:       this.filters
      };

      const { cards, count } = await serverFetchCards(payload);

      this.cards = cards;
      this.count = count;
    }),
    addFilter:     $(async function (this, filter) {
      this.filters.push(filter);
      const payload: FetchCardsPayload = {
        page:          this.page,
        size:          this.size,
        sortBy:        this.sortBy,
        sortDirection: this.sortDirection,
        filters:       this.filters
      };

      const { cards, count } = await serverFetchCards(payload);

      this.cards = cards;
      this.count = count;
    }),
    removeFilter:  $(async function (this, id) {
      this.filters = this.filters.filter(f => f.id !== id);
      this.page    = 1;

      const payload: FetchCardsPayload = {
        page:          this.page,
        size:          this.size,
        sortBy:        this.sortBy,
        sortDirection: this.sortDirection,
        filters:       this.filters
      };

      const { cards, count } = await serverFetchCards(payload);

      this.cards = cards;
      this.count = count;
    }),
  });
}

export const FilterContext = createContextId<FilterContextState>('filter-context');
