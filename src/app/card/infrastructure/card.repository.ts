import type PostgrestTransformBuilder from '@supabase/postgrest-js/src/PostgrestTransformBuilder';
import type { SupabaseClient }        from '@supabase/supabase-js';
import type { CardRawDto }            from '~/app/card/domain/DTO/cardRaw.dto';
import type { CardInfo }              from '~/app/card/domain/models/card.model';
import { Card }                       from '~/app/card/domain/models/card.model';

import { TOKENS } from '~/app/shared/binds/TOKENS';

import type { Specification } from '~/app/shared/domain/models/specification';
import type { IdValueObject } from '~/app/shared/domain/VO/id.valueObject';

import { Logger } from '~/lib/logger';

// TODO REFACTOR
import { convertFiltersToExpression, convertToFilter } from '~/models/filters/Filter';
import type { FetchCardsPayload }                      from '~/models/infrastructure/FetchCardsPayload';

import type { Database } from '../../../../database.types';


class CardRepository {
  public static inject = [TOKENS.SUPABASE];

  constructor(private readonly supabase: SupabaseClient<Database, 'public'>) {
  }

  // TODO REFACTOR, should use finder I guess ?
  async fetchCards(filters: Specification[]): Promise<{ cards: CardInfo[]; count: number; }> {
    let query = this.supabase.from('cards').select('*', { count: 'exact' });

    for (const filter of filters) {
      // @ts-expect-error
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

  async getCardsByAlbumId(albumId: IdValueObject): Promise<Card[]> {
    const { data } = await this.supabase.from('user_cards_by_album')
      .select().eq('album_id', albumId.value).throwOnError().overrideTypes<CardRawDto[]>();

    if (!data) return [];

    return data.toSorted((a, b) => a.name!.localeCompare(b.name)).map(c => {
      return Card.HYDRATE(c);
    });
  }

  async getCardsByDeckId(deckId: IdValueObject): Promise<Card[]> {
    const { data, error } = await this.supabase.from('deck_card').select(`
    card,
    cards(
    *
    )
    `)
      .eq('deck', deckId.value);

    if (error) {
      Logger.error(error.message);
      throw error;
    }

    return data.map(c => {
      return Card.HYDRATE(c.cards);
    });
  }

  async getById(id: IdValueObject): Promise<Card> {
    const { data: cardData, error } = await this.supabase
      .from('cards')
      .select()
      .eq('id', id.value)
      .single();

    if (error) {
      Logger.error(error, `Error fetching card with id ${id.value}`);
      throw error;
    }

    return Card.HYDRATE(cardData);
  }

  // TODO REFACTOR, not used
  public async getCount(filter: FetchCardsPayload): Promise<number> {
    const query = this.supabase
      .from('cards')
      .select('*', { count: 'exact', head: true })
      .order(filter.sortBy, { ascending: filter.sortDirection === 'asc' })
      .range((Number(filter.page) - 1) * Number(filter.size), (Number(filter.page) * Number(filter.size)) - 1);

    // @ts-expect-error
    this.addFilters(query, filter);

    const { count, error } = await query;

    if (error) {
      Logger.error(error, `${CardRepository.name} ${this.getCount.name}`);
      return 0;
    }

    return count || 0;
  }


  // TODO REFACTOR, not used
  public async getCardList(filter: FetchCardsPayload): Promise<Card[]> {
    const supabase = this.supabase;

    const query = supabase
      .from('cards')
      .select()
      .order(filter.sortBy, { ascending: filter.sortDirection === 'asc' })
      .range((Number(filter.page) - 1) * Number(filter.size), (Number(filter.page) * Number(filter.size)) - 1);

    // @ts-expect-error
    this.addFilters(query, filter);

    const { data, error } = await query;

    if (error) {
      Logger.error(error, `${CardRepository.name} ${this.getCardList.name}`);
    }

    if (!data) {
      return [];
    }

    // @ts-expect-error
    return data.map(c => {
      return {
        ...c,
        image: c.image
      };
    });
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
      // @ts-expect-error
      query = query!.or(e);
    });
  }
}

export default CardRepository;
