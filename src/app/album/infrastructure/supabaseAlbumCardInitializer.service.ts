import { SupabaseClient }              from '@supabase/supabase-js';
import { AlbumCardInitializerService } from '~/app/album/application/services/albumCardInitializer.service';
import { TOKENS }                      from '~/app/shared/binds/TOKENS';
import { IdValueObject }               from '~/app/shared/domain/VO/id.valueObject';
import { Database }                    from '../../../../database.extension.types';

export class SupabaseAlbumCardInitializerService implements AlbumCardInitializerService {
  static inject = [TOKENS.SUPABASE]

  constructor(private readonly supabase: SupabaseClient<Database, 'public'>) {
  }

  async initializeAlbumCards(albumId: IdValueObject): Promise<void> {
    await this.supabase.rpc('initialize_album_cards', {
      p_album_id: albumId.value,
    })
  }
}
