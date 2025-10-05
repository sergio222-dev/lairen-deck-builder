import { getDefaultFilterValues }                             from '~/app/filter/application/getDefaultFilterValues';
import { FilterType }                                         from '~/app/filter/filter/models/Specification';
import type { FilterRepository }                              from '~/app/filter/infrastructure/filter.repository';
import type { FilterDefinition }                              from '~/UI/filters/models/filterDefinition.model';
import { CATEGORY_FILTERS, DEFAULT_PAGINATION, DEFAULT_SORT } from '~/UI/filters/models/filterDefinition.model';

const RARITY_ORDER = ['BRONCE', 'PLATA', 'ORO', 'DIAMANTE', 'ESMERALDA'];

const SET_ORDER = [
  'FUNDAMENTOS',
  'PACTO SECRETO',
  'TRONO COMPARTIDO',
  'IMPERIO',
  'ANCESTROS',
  'PROFUNDIDADES',
  'HERMANDAD EN BERIN'
];

export async function getDefaultFilterGroups(filterRepo: FilterRepository): Promise<FilterDefinition[]> {
  const initialFiltersValues = await getDefaultFilterValues(filterRepo,
    ['card_rarity', 'card_sets', 'card_supertypes', 'card_types', 'card_subtypes']);

  return [
    {
      id:              CATEGORY_FILTERS.PAGINATION,
      field:           [],
      label:           'Pagination',
      type:            FilterType.RANGE,
      availableValues: [],
      currentValues:   [
        {
          value: '0',
          label: '0'
        },
        {
          value: DEFAULT_PAGINATION.size.toString(),
          label: DEFAULT_PAGINATION.size.toString()
        }
      ]
    },
    {
      id:              CATEGORY_FILTERS.SORT,
      field:           [DEFAULT_SORT.field],
      label:           'Sort',
      type:            FilterType.ORDER,
      availableValues: [],
      currentValues:   [{
        value: DEFAULT_SORT.direction,
        label: DEFAULT_SORT.direction
      }]
    },
    {
      id:              CATEGORY_FILTERS.SUB_TYPE,
      field:           ['subtype', 'subtype2'],
      label:           'Sub Type',
      type:            FilterType.IN,
      availableValues: initialFiltersValues['card_subtypes']!.map(s => ({
        value: s,
        label: s.toUpperCase()
      })).sort((a, b) => a.label.localeCompare(b.label)),
      currentValues:   [],
      exclusive:       false
    },
    {
      id:              CATEGORY_FILTERS.TYPE,
      field:           ['type'],
      label:           'Type',
      type:            FilterType.IN,
      availableValues: initialFiltersValues['card_types']!.map(s => ({
        value: s,
        label: s.toUpperCase()
      })).sort((a, b) => a.label.localeCompare(b.label)),
      currentValues:   []
    },
    {
      id:              CATEGORY_FILTERS.SUPER_TYPE,
      field:           ['supertype'],
      label:           'Super type',
      type:            FilterType.IN,
      availableValues: initialFiltersValues['card_supertypes']!.map(s => ({
        value: s,
        label: s.toUpperCase()
      })),
      currentValues:   []
    },
    {
      id:              CATEGORY_FILTERS.SET,
      field:           ['set'],
      label:           'Set',
      type:            FilterType.IN,
      availableValues: initialFiltersValues['card_sets']!.map(s => ({
        value: s,
        label: s.toUpperCase()
      })).sort((a, b) => SET_ORDER.indexOf(a.label) - SET_ORDER.indexOf(b.label)),
      currentValues:   []
    },
    {
      id:              CATEGORY_FILTERS.TEXT,
      field:           ['name', 'text'],
      label:           'Name',
      type:            FilterType.ILIKE,
      availableValues: [],
      currentValues:   [],
      exclusive:       false
    },
    {
      id:              CATEGORY_FILTERS.RARITY,
      field:           ['rarity'],
      label:           'Rarity',
      type:            FilterType.IN,
      availableValues: initialFiltersValues['card_rarity']!.map(s => ({
        value: s,
        label: s.toUpperCase()
      })).sort((a, b) => RARITY_ORDER.indexOf(a.label) - RARITY_ORDER.indexOf(b.label)),
      currentValues:   []
    }
  ];

}
