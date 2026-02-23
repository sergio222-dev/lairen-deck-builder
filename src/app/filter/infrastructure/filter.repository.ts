import type { RequestEventBase, RequestEventLoader } from '@builder.io/qwik-city';
import type { SupabaseClient }                       from '@supabase/supabase-js';
import { createClientServer }                        from '~/lib/supabase-qwik';
import type { Database }                             from '../../../../database.types';

// TODO move this to card repository
export class FilterRepository {
  private readonly supabase: SupabaseClient<Database, 'public'>;

  constructor(request: RequestEventLoader | RequestEventBase) {
    this.supabase = createClientServer(request);
  }

  // async fetchViewValue(view: keyof Database['public']['Views']): {name: string}[] {
  //   const supabase = this.supabase;
  //
  //   return supabase.from(view).select();
  // }

  // async fetchCards(filters: Specification[]): Promise<{ cards: CardInfo[]; count: number; }> {
  //   const supabase = this.supabase;
  //
  //   let query = supabase.from('cards').select('*', { count: 'exact' });
  //
  //   for (const filter of filters) {
  //     query = filter.apply(query);
  //   }
  //
  //   const { data, error, count } = await query;
  //
  //   if (error) {
  //     throw new Error(`Error fetching cards: ${error.message}`);
  //   }
  //
  //   const cards = data.map(c => {
  //     return {
  //       id:             c.id,
  //       name:           c.name,
  //       rarity:         c.rarity,
  //       type:           c.type,
  //       supertype:      c.supertype,
  //       subtype1:       c.subtype,
  //       subtype2:       c.subtype2,
  //       cost:           parseInt(c.cost),
  //       text:           c.text,
  //       image:          c.image,
  //       thumbnail:      c.thumbnail,
  //       set:            c.set,
  //       clarifications: c.clarifications
  //     };
  //   });
  //
  //   return { cards, count: count ?? 0 };
  // }
}
