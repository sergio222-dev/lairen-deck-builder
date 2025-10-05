import type { RequestEventBase, RequestEventLoader } from '@builder.io/qwik-city';
import type { SupabaseClient }                       from '@supabase/supabase-js';
import { Album }                                     from '~/app/album/models/album.model';
import { IdValueObject }                             from '~/app/shared/models/VO/Id.ValueObject';
import { NameValueObject }                           from '~/app/shared/models/VO/Name.ValueObject';
import type { UserIdValueObject }                    from '~/app/shared/models/VO/UserId.ValueObject';
import { Logger }                                    from '~/lib/logger';
import { createClientServer }                        from '~/lib/supabase-qwik';
import type { Database }                             from '../../../../database.types';

export class AlbumRepository {
  private readonly supabase: SupabaseClient<Database, 'public'>;

  constructor(request: RequestEventLoader | RequestEventBase) {
    this.supabase = createClientServer(request);
  }

  async listByUserOwner(owner: UserIdValueObject) {
    const supabase = this.supabase;

    const { error, data } = await supabase.from('albums').select().eq('owner', owner.value);

    if (error) {
      Logger.error(error, error.message);
      throw error;
    }

    return data.map(a => {
      return Album.CREATE_ALBUM({
        id:   new IdValueObject(a.id),
        name: new NameValueObject(a.name)
      });
    });
  }
}
