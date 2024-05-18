import type { RequestEventBase, RequestEventLoader } from '@builder.io/qwik-city';
import { Logger }                                    from '~/lib/logger';
import { createClientServer }                        from '~/lib/supabase-qwik';
import type { Card }                                 from '~/models/Card';

interface CardListFilter {
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  types: string[];
  page: number;
  size: number;
  name: string;
}

export class CardRepository {

  private readonly request: RequestEventLoader | RequestEventBase;

  constructor(request: RequestEventLoader | RequestEventBase) {
    this.request = request;
  }

  public async getCount(filter: CardListFilter): Promise<number> {
    const supabase = createClientServer(this.request);

    let query = supabase
      .from('cards')
      .select('*', { count: 'exact', head: true })
      .or(`name.ilike.%${filter.name}%`)
      .order(filter.sortBy, { ascending: filter.sortDirection === 'asc' })
      .range((Number(filter.page) - 1) * Number(filter.size), (Number(filter.page) * Number(filter.size)) - 1);

    if (filter.types.length > 0) {
      query = query.in('subtype', filter.types);
    }

    const { count, error } = await query;

    if (error) {
      Logger.error(error, `${CardRepository.name} ${this.getCount.name}`);
      return 0;
    }

    return count || 0;
  }

  public async getCardList(filter: CardListFilter): Promise<Card[]> {
    const supabase = createClientServer(this.request);

    let query = supabase
      .from('cards')
      .select()
      .or(`name.ilike.%${filter.name}%`)
      .order(filter.sortBy, { ascending: filter.sortDirection === 'asc' })
      .range((Number(filter.page) - 1) * Number(filter.size), (Number(filter.page) * Number(filter.size)) - 1);

    if (filter.types.length > 0) {
      query = query.in('subtype', filter.types);
    }

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
        image: this.getCardImageUrl(c.image + '.webp')
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

  public getCardImageUrl(imageName: string): string {
    const supabase = createClientServer(this.request);

    const { data } = supabase.storage.from('CardImages/cards').getPublicUrl(imageName);

    return data.publicUrl;

  }
}
