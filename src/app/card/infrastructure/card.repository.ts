// @ts-ignore
import type PostgrestTransformBuilder                  from '@supabase/postgrest-js/src/PostgrestTransformBuilder';
import type { SupabaseClient }                         from '@supabase/supabase-js';
import type { CardInfo }                               from '~/app/card/models/card.model';
import type { Specification }                          from '~/app/filter/filter/models/Specification';
import { TOKENS }                                      from '~/app/shared/binds/TOKENS';
import { StringValueObject }                           from '~/app/shared/models/VO/StringValueObject';
import { Logger }                                      from '~/lib/logger';
import type { Card }                                   from '~/models/Card';
import { convertFiltersToExpression, convertToFilter } from '~/models/filters/Filter';
import type { FetchCardsPayload }                      from '~/models/infrastructure/FetchCardsPayload';
import type { Database }                               from '../../../../database.types';

type View = 'card_types' | 'card_subtypes' | 'card_sets' | 'card_rarity' | 'unit_types' | 'card_supertypes';

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

export class CardRepository {

  public static inject = [TOKENS.SUPABASE];

  constructor(private readonly supabase: SupabaseClient<Database, 'public'>) {}

  async fetchCards(filters: Specification[]): Promise<{ cards: CardInfo[]; count: number; }> {
    const supabase = this.supabase;

    let query = supabase.from('cards').select('*', { count: 'exact' });

    for (const filter of filters) {
      query = filter.apply(query);
    }

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Error fetching cards: ${error.message}`);
    }

    const cards = data.map(c => {
      return {
        id:             c.id,
        name:           c.name,
        rarity:         c.rarity,
        type:           c.type,
        supertype:      c.supertype,
        subtype1:       c.subtype,
        subtype2:       c.subtype2,
        cost:           parseInt(c.cost),
        text:           c.text,
        image:          c.image,
        thumbnail:      c.thumbnail,
        set:            c.set,
        clarifications: c.clarifications
      };
    });

    return { cards, count: count ?? 0 };
  }

  public async getAvailableSet(): Promise<string[]> {
    const supabase = this.supabase;

    const { error, data } = await supabase.from('card_sets').select();

    if (error) {
      Logger.error(error, error.message);
      throw error;
    }

    return data.map(s => s.name) as string[];
  }

  public async getCount(filter: FetchCardsPayload): Promise<number> {
    const query = this.supabase
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

  public async fetchCardDataByDeck(deckId: number): Promise<CardInfo[]> {
    const { data, error } = await this.supabase.from('deck_card').select('cards (*)').eq('deck', deckId);

    if (error) {
      Logger.error(error, `Error fetching card for deck`);
      throw new Error('Error fetching card for deck', { cause: error });
    }

    return data.map(c => {
      return {
        id:        c.cards!.id,
        name:      c.cards!.name,
        rarity:    c.cards!.rarity,
        type:      c.cards!.type,
        supertype: c.cards!.supertype,
        subtype1:  c.cards!.subtype,
        subtype2:  c.cards!.subtype2,
        cost:      c.cards!.cost,
        text:      c.cards!.text,
        image:     c.cards!.image,
        thumbnail: c.cards!.thumbnail,
        set:       c.cards!.set
      };
    });

  }

  public async getCard(id: number): Promise<Card | null> {
    const supabase = this.supabase;

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
    const supabase = this.supabase;

    const query = supabase
      .from('cards')
      .select()
      .order(filter.sortBy, { ascending: filter.sortDirection === 'asc' })
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
        image: c.image
      };
    });
  }

  public async getViewCard(view: View): Promise<string[]> {
    const supabase = this.supabase;

    let table: View;

    switch (view) {
      case 'card_supertypes':
        table = 'card_supertypes';
        break;
      case 'card_types':
        table = 'card_types';
        break;
      case 'card_subtypes':
        table = 'card_subtypes';
        break;
      case 'card_sets':
        table = 'card_sets';
        break;
      case 'card_rarity':
        table = 'card_rarity';
        break;
      case 'unit_types':
        table = 'unit_types';
        break;
      default:
        table = 'card_types';
        break;
    }

    const { data, error } = await supabase
      .from(table)
      .select();

    if (error) {
      Logger.error(error, `${CardRepository.name} ${this.getViewCard.name}`);
    }

    if (!data) {
      return [];
    }

    const values                      = data.map(c => c.name);
    const valuesWithoutNull: string[] = [];
    // remove null values
    values.forEach(c => {
      if (c !== null) {
        valuesWithoutNull.push(c);
      }
    });

    // order alphabetically
    if (view !== 'card_sets' && view !== 'card_rarity') {
      valuesWithoutNull.sort((a, b) => a.localeCompare(b));
    } else if (view === 'card_rarity') {
      valuesWithoutNull.sort((a, b) => {
        return RARITY_ORDER.indexOf(a) - RARITY_ORDER.indexOf(b);
      });
    } else {
      valuesWithoutNull.sort((a, b) => {
        return SET_ORDER.indexOf(a) - SET_ORDER.indexOf(b);
      });
    }
    return valuesWithoutNull;
  }

  private addFilters(query: PostgrestTransformBuilder<any, any, any, any>, filter: FetchCardsPayload) {
    if (filter.filters.length === 0) return;
    const containsFilters = filter.filters.filter(f => f.isContains);
    const inFilters       = filter.filters.filter(f => !f.isContains);

    const containsFiltersExpression: string[] = [];
    containsFilters.forEach(f => {
      const [, , value] = convertToFilter(f);
      // query             = query.or(`name.ilike.%${value}%, text.ilike.%${value}%`);
      containsFiltersExpression.push(`name.ilike.%${value}%, text.ilike.%${value}%`);
    });

    const mapFilters = convertFiltersToExpression(inFilters);

    [...mapFilters, ...containsFiltersExpression].forEach(e => {
      query = query.or(e);
    });
  }
}
