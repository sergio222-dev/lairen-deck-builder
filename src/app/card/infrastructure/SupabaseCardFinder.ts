import type { SupabaseClient } from '@supabase/supabase-js';

import type { CardFinder }         from '~/app/card/application/finder/Card.finder';
import type { CardInfoProjection } from '~/app/shared/application/projections/CardInfoProjection';
import { TOKENS }                  from '~/app/shared/binds/TOKENS';

import { Logger }        from '~/lib/logger';
import type { Database } from '../../../../database.extension.types';

export class SupabaseCardFinder implements CardFinder {
  static readonly inject = [TOKENS.SUPABASE];

  constructor(private readonly supabse: SupabaseClient<Database, 'public'>) {
  }

  async findCards(cards: string[]): Promise<CardInfoProjection[]> {
    const { data, error: cardError } = await this.supabse.from('cards').select().in('name',
      cards);

    if (cardError) {
      Logger.error(cardError);
      throw cardError;
    }

    return data.map<CardInfoProjection>(c => {
      return {
        ...c,
        cost:     parseInt(c.cost),
        subtype1: c.subtype,
        subtype2: c.subtype2
      };
    });
  }
}
