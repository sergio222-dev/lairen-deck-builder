import type { RequestEventBase, RequestEventLoader } from '@builder.io/qwik-city';
import { Logger }                                    from '~/lib/logger';
import { createClientServer }                        from '~/lib/supabase-qwik';
import type { Card }                                 from '~/models/Card';
import { convertToFilter }                           from "~/models/filters/Filter";
import type { FetchCardsPayload }                    from "~/models/infrastructure/FetchCardsPayload";
import { getCardImageUrl }                           from '~/utils/cardImage';

export class CardRepository {

  private readonly request: RequestEventLoader | RequestEventBase;

  constructor(request: RequestEventLoader | RequestEventBase) {
    this.request = request;
  }

  public async getCount(filter: FetchCardsPayload): Promise<number> {
    const supabase = createClientServer(this.request);

    let query = supabase
      .from('cards')
      .select('*', { count: 'exact', head: true })
      .order(filter.sortBy, { ascending: filter.sortDirection === 'asc' })
      .range((Number(filter.page) - 1) * Number(filter.size), (Number(filter.page) * Number(filter.size)) - 1);

    filter.filters.forEach(f => {
      const [field, operator, value] = convertToFilter(f);
      query                          = query.filter(field, operator, value);
    })

    const { count, error } = await query;

    if (error) {
      Logger.error(error, `${CardRepository.name} ${this.getCount.name}`);
      return 0;
    }

    return count || 0;
  }

  public async getCard(id: string): Promise<Card | null> {
    const supabase = createClientServer(this.request);

    const query = supabase
      .from('cards')
      .select()
      .eq('id', id);

    const { data, error } = await query;

    if (error) {
      Logger.error(error, `${CardRepository.name} ${this.getCard.name}`);
      return null;
    }

    return data[0];
  }

  public async getCardList(filter: FetchCardsPayload): Promise<Card[]> {
    const supabase = createClientServer(this.request);


    let query = supabase
      .from('cards')
      .select()
      .order(filter.sortBy, { ascending: filter.sortDirection === 'asc' })
      .range((Number(filter.page) - 1) * Number(filter.size), (Number(filter.page) * Number(filter.size)) - 1);

    const disjunctiveFilters = filter.filters.filter(f => f.isDisjunctive);

    disjunctiveFilters.forEach(f => {
      const [field, operator, value] = convertToFilter(f);
      query                          = query.or(`${field}.${operator}.${value}`);
    })

    filter.filters.filter(f => !f.isDisjunctive).forEach(f => {
      const [field, operator, value] = convertToFilter(f);
      query                          = query.filter(field, operator, value);
    })


    const { data, error } = await query;

    if (error) {
      Logger.error(error, `${CardRepository.name} ${this.getCardList.name}`);
    }

    if (!data) {
      return [];
    }

    return data.map(c => {
      return {
        ...c,
        image: getCardImageUrl(c.image, this.request)
      };
    });
  }

  public async getCardSubtype() {

    const supabase = createClientServer(this.request);

    const { data, error } = await supabase
      .from('deck_types')
      .select();

    if (error) {
      Logger.error(error, `${CardRepository.name} ${this.getCardSubtype.name}`);
    }

    if (!data) {
      return [];
    }

    return data;

  }
}
