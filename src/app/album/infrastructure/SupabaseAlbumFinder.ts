import type { SupabaseClient }      from '@supabase/supabase-js';
import type { AlbumFinder }         from '~/app/album/application/finder/albumFinder';
import type { AlbumCardProjection } from '~/app/album/application/projection/AlbumCardProjection';
import { TOKENS }                   from '~/app/shared/binds/TOKENS';
import { Logger }                   from '~/lib/logger';
import type { Database }            from '../../../../database.extension.types';

export class SupabaseAlbumFinder implements AlbumFinder {
  static readonly inject = [TOKENS.SUPABASE];

  constructor(private readonly supabase: SupabaseClient<Database, 'public'>) {
  }

  async getAllCardsInfoProjection(): Promise<AlbumCardProjection[]> {

    const { data: authData, error: authError } = await this.supabase.auth.getUser();

    if (authError) {
      Logger.error(authError);
      throw authError;
    }

    const owner = authData.user.id;

    const { data, error } = await this.supabase.from('album_cards').select(`
    *, albums ( owner )
    `).eq('albums.owner', owner);

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
