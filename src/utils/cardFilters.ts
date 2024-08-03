import type { FetchCardsPayload } from "~/models/infrastructure/FetchCardsPayload";

export const getDefaultFilter = (size = 20): FetchCardsPayload => {
  return {
    size,
    page: 1,
    sortBy: 'name',
    sortDirection: 'asc',
    filters: []
  }
}
