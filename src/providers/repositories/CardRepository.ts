import type { RequestEventBase, RequestEventLoader }   from '@builder.io/qwik-city';
// @ts-ignore
import type PostgrestTransformBuilder                  from "@supabase/postgrest-js/src/PostgrestTransformBuilder";
import { Logger }                                      from '~/lib/logger';
import { createClientServer }                          from '~/lib/supabase-qwik';
import type { Card }                                   from '~/models/Card';
import { convertFiltersToExpression, convertToFilter } from "~/models/filters/Filter";
import type { FetchCardsPayload }                      from "~/models/infrastructure/FetchCardsPayload";
import { getCardImageUrl }                             from '~/utils/cardImage';

export class CardRepository {

  private readonly request: RequestEventLoader | RequestEventBase;

  constructor(request: RequestEventLoader | RequestEventBase) {
    this.request = request;
  }

  public async getCount(filter: FetchCardsPayload): Promise<number> {
    const supabase = createClientServer(this.request);

    const query = supabase
      .from('cards')
      .select('*', { count: 'exact', head: true })
      .order(filter.sortBy, { ascending: filter.sortDirection === 'asc' })
      .range((Number(filter.page) - 1) * Number(filter.size), (Number(filter.page) * Number(filter.size)) - 1);

    this.addFilters(query, filter);

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

    const query = supabase
      .from('cards')
      .select()
      .order(filter.sortBy, { ascending: filter.sortDirection === 'asc' })
      // .or(`subtype.in.(MAGO,ANIMAL), subtype2.in.(MAGO,ANIMAL)`)
      // .or(`cost.in.(1)`)
      .range((Number(filter.page) - 1) * Number(filter.size), (Number(filter.page) * Number(filter.size)) - 1);

    this.addFilters(query, filter);

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

  public async getCardSubtype(): Promise<string[]> {

    const supabase = createClientServer(this.request);

    const { data, error } = await supabase
      .from('card_types')
      .select();

    if (error) {
      Logger.error(error, `${CardRepository.name} ${this.getCardSubtype.name}`);
    }

    if (!data) {
      return [];
    }

    const subtypes = data.map(c => c.name);
    const subtypesWithoutNull: string[] = [];
    // remove null values
    subtypes.forEach(c => {
      if (c !== null) {
        subtypesWithoutNull.push(c);
      }
    });

    return subtypesWithoutNull;
  }

  private addFilters(query: PostgrestTransformBuilder, filter: FetchCardsPayload) {
    if (filter.filters.length === 0) return;
    const containsFilters = filter.filters.filter(f => f.isContains);
    const inFilters       = filter.filters.filter(f => !f.isContains);

    const containsFiltersExpression: string[] = [];
    containsFilters.forEach(f => {
      const [, , value] = convertToFilter(f);
      // query             = query.or(`name.ilike.%${value}%, text.ilike.%${value}%`);
      containsFiltersExpression.push(`name.ilike.%${value}%, text.ilike.%${value}%`);
    })

    const mapFilters = convertFiltersToExpression(inFilters);

    [...mapFilters, ...containsFiltersExpression].forEach(e => {
      query = query.or(e);
    });
  }
}
