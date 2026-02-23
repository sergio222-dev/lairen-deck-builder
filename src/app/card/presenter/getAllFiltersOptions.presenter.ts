import { CardFilterOptions }         from '~/app/card/application/finder/cardFilterOptions.finder';
import type { GetCardFilterOptions } from '~/app/card/application/getCardFilterOptions';
import type { FiltersOptions }       from '~/app/card/application/projections/filtersOptions';
import { TOKENS }                    from '~/app/shared/binds/TOKENS';
import { FilterType }                from '~/app/shared/domain/models/specification'; // TODO revisar
import type {
  UIFilterDefinition, UIFilterValues,
  UIFilterValuesList
}                                    from '~/UI/filters/models/filterDefinition.model';
import {
  CATEGORY_FILTERS,
  DEFAULT_PAGINATION,
  DEFAULT_SORT
}                                    from '~/UI/filters/models/filterDefinition.model';

export class GetAllFiltersOptionsPresenter {
  static readonly inject = [TOKENS.GET_FILTER_OPTIONS];

  constructor(private readonly getFilterOptions: GetCardFilterOptions) {
  }

  async execute(): Promise<UIFilterDefinition[]> {
    const list: UIFilterValuesList = {
      SUPER_TYPE: [],
      SET:        [],
      SUB_TYPE:   [],
      TYPE:       []
    };

    const sets  = await this.getFilterOptions.execute(CardFilterOptions.SETS);
    list['SET'] = this.convertAndOrder(sets, false);

    const types  = await this.getFilterOptions.execute(CardFilterOptions.TYPES);
    list['TYPE'] = this.convertAndOrder(types);

    const subTypes   = await this.getFilterOptions.execute(CardFilterOptions.SUBTYPES);
    list['SUB_TYPE'] = this.convertAndOrder(subTypes);

    const superTypes   = await this.getFilterOptions.execute(CardFilterOptions.SUPERTYPES);
    list['SUPER_TYPE'] = this.convertAndOrder(superTypes);

    const rarity = [
      {
        label: 'BRONCE',
        value: 'BRONCE'
      },
      {
        label: 'PLATA',
        value: 'PLATA'
      },
      {
        label: 'ORO',
        value: 'ORO'
      },
      {
        label: 'DIAMANTE',
        value: 'DIAMANTE'
      },
      {
        label: 'ESMERALDA',
        value: 'ESMERALDA'
      }
    ];


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
        id: CATEGORY_FILTERS.COST,
        field: ['cost'],
        label: 'Cost',
        type: FilterType.IN,
        availableValues: Array.from({ length: 10}, (x, i) => i).map<UIFilterValues>(x => ({
          value: x.toString(),
          label: `Cost: ${x.toString()}`,
        })),
        currentValues: [],
      },
      {
        id:              CATEGORY_FILTERS.SUB_TYPE,
        field:           ['subtype', 'subtype2'],
        label:           'Sub Type',
        type:            FilterType.IN,
        availableValues: list['SUB_TYPE'],
        currentValues:   [],
        exclusive:       false
      },
      {
        id:              CATEGORY_FILTERS.TYPE,
        field:           ['type'],
        label:           'Type',
        type:            FilterType.IN,
        availableValues: list['TYPE'],
        currentValues:   []
      },
      {
        id:              CATEGORY_FILTERS.SUPER_TYPE,
        field:           ['supertype'],
        label:           'Super type',
        type:            FilterType.IN,
        availableValues: list['SUPER_TYPE'],
        currentValues:   []
      },
      {
        id:              CATEGORY_FILTERS.SET,
        field:           ['set'],
        label:           'Set',
        type:            FilterType.IN,
        availableValues: list['SET'],
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
        availableValues: rarity,
        currentValues:   []
      }
    ];
  }

  private convertAndOrder(list: FiltersOptions[], order = true) {
    const r = list
      .map(x => ({ value: x.value, label: x.value.toUpperCase() }));
    return order ? r.toSorted((a, b) => a.label.localeCompare(b.label)) : r;
  }
}
