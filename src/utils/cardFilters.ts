import { CardFilters } from '~/stores/filterContext';

export const getDefaultFilter = (size = 20): CardFilters => {
  return {
    size,
    page: 1,
    sortBy: 'name',
    sortDirection: 'asc',
    name: '',
    types: [],
  }
}
