import type { SupabaseClient } from '@supabase/supabase-js';

import type { CardFinder }        from '~/app/card/application/finder/card.finder';
import type { CardInfoProection } from '~/app/shared/application/projections/cardInfo.proection';
import { TOKENS }             from '~/app/shared/binds/TOKENS';
import type { Specification } from '~/app/shared/domain/models/specification';

import { Logger }        from '~/lib/logger';
import type { Database } from '../../../../database.extension.types';

export class SupabaseCardFinder implements CardFinder {
  static readonly inject = [TOKENS.SUPABASE];

  constructor(private readonly supabse: SupabaseClient<Database, 'public'>) {
  }

  async findCardsByName(cards: string[]): Promise<CardInfoProection[]> {
    const { data, error: cardError } = await this.supabse.from('cards').select().in('name',
      cards);

    if (cardError) {
      Logger.error(cardError);
      throw cardError;
    }

    return data.map<CardInfoProection>(c => {
      return {
        ...c,
        cost:     parseInt(c.cost),
        subtype1: c.subtype,
        subtype2: c.subtype2
      };
    });
  }

  async fetchCards(specs: Specification[], dominion = false): Promise<[CardInfoProection[], number | null]> {

    let dominionSetsAvailable: string[] = [];
    if (dominion) {
      const { data: dominionSets, error: dominionError } = await this.supabse.from('dominion').select();

      if (dominionError) throw dominionError;

      dominionSetsAvailable = dominionSets.filter(x => {
        return x.name !== null;
      }).map(x => x.name as string);
    }

    let q = this.supabse.from('cards').select('*', { count: 'exact' });

    if (dominion) {
      q.in('set', dominionSetsAvailable);
    }

    specs.forEach((spec) => {
      // @ts-ignore
      q = spec.apply(q);
    });

    const { data, error, count } = await q;

    if (error) {
      throw error;
    }

    return [data.map<CardInfoProection>(x => {
      return {
        ...x,
        cost:     parseInt(x.cost),
        subtype1: x.subtype,
        subtype2: x.subtype2
      };
    }), count];
  }
}
