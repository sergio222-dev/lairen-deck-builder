import type { Filter } from "~/models/filters/Filter";

export interface FetchCardsPayload {
  page: number;
  size: number;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  filters: Filter[];
}
