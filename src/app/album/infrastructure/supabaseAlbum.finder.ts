import type { SupabaseClient }      from '@supabase/supabase-js';
import type { AlbumFinder }         from '~/app/album/application/finder/album.finder';
import type { AlbumCardProjection } from '~/app/album/application/projection/albumCard.projection';
import { TOKENS }                 from '~/app/shared/binds/TOKENS';
import type { UserIdValueObject } from '~/app/shared/domain/VO/userId.valueObject';
import type { Database }          from '../../../../database.extension.types';

export class SupabaseAlbumFinder implements AlbumFinder {
  static readonly inject = [TOKENS.SUPABASE];

  constructor(private readonly supabase: SupabaseClient<Database, 'public'>) {
  }

  async getAllCardsInfoProjection(ownerId: UserIdValueObject): Promise<AlbumCardProjection[]> {

    const { data, error } = await this.supabase.from('album_cards').select(`
    *, albums ( owner )
    `).eq('albums.owner', ownerId.value);

    if (error) throw error;

    const reducesCards = data.reduce((a, c) => {
      if (!a[c.card_id]) {
        a[c.card_id] = c.quantity;
      } else {
        a[c.card_id] += c.quantity;
      }

      return a;
    }, {} as Record<number, number>);

    return Object.entries(reducesCards).map<AlbumCardProjection>(([id, quantity]) => {
      return {
        id: parseInt(id),
        quantity
      };
    });
  }
}
