import type { Card }        from '~/models/Card';
import { SupabaseProvider } from '~/providers/supabaseProvider';

interface CardListFilter {
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  types: string[];
  page: number;
  size: number;
  name: string;
}

export class CardRepository {

  public async getCount(filter: CardListFilter): Promise<number> {
    const supabase = SupabaseProvider.getSupabaseClient();

    const { count, error } = await supabase
      .from('cards')
      .select('*', { count: 'exact', head: true })
      .or(`name.ilike.%${filter.name}%`)
      .order(filter.sortBy, { ascending: filter.sortDirection === 'asc' })
      .range(Number(filter.page) - 1, Number(filter.page) - 1 + (Number(filter.size) - 1));

    if (error) {
      console.error(`qxc error`, error);
      return 0;
    }

    return count || 0;
  }

  public async getCardList(filter: CardListFilter): Promise<Card[]> {
    const supabase = SupabaseProvider.getSupabaseClient();



    let query = supabase
    .from('cards')
    .select()
    .or(`name.ilike.%${filter.name}%`)
    .order(filter.sortBy, { ascending: filter.sortDirection === 'asc' })
    .range((Number(filter.page) - 1) * Number(filter.size), (Number(filter.page) * Number(filter.size)) -1);

    if (filter.types.length > 0) {
      query = query.in('subtype', filter.types);
    }

    const { data, error } = await query;

    if (error) {
      console.error(`qxc error`, error);
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

    const supabase = SupabaseProvider.getSupabaseClient();

    const { data, error } = await supabase
      .from('deck_types')
      .select();

    if (error) {
      console.error(`qxc error`, error);
    }

    if (!data) {
      return [];
    }

    return data

  }

  public getCardImageUrl(imageName: string): string {
    const supabase = SupabaseProvider.getSupabaseClient();

    const { data } = supabase.storage.from('CardImages/cards').getPublicUrl(imageName);

    return data.publicUrl;

  }
}
