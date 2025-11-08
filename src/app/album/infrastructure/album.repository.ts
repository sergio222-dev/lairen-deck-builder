import type { SupabaseClient } from '@supabase/supabase-js';
import { AlbumCardAttachedEvent } from '~/app/album/events/albumCardAttached.event';
import { AlbumCreatedEvent }   from '~/app/album/events/albumCreated.event';
import { Album }               from '~/app/album/models/album.model';

import { TOKENS }                 from '~/app/shared/binds/TOKENS';
import type { IdValueObject }     from '~/app/shared/models/VO/Id.ValueObject';
import type { UserIdValueObject } from '~/app/shared/models/VO/UserId.ValueObject';
import { Logger }                 from '~/lib/logger';
import type { Database }          from '../../../../database.types';

export class AlbumRepository {
  public static inject = [TOKENS.SUPABASE];

  constructor(private readonly supabase: SupabaseClient<Database, 'public'>) {
  }

  async getAlbumById(id: IdValueObject) {
    const { data, error } = await this.supabase.from('albums').select(`
    id,
    name,
    sets,
    owner,
    total,
    current,
    album_tag (
      id,
      name
    ),
    album_cards (
      cards (
        id,
        name,
        image
      ),
      album_card_tags (
        quantity,
        album_tag (
          id,
          name
        )
      )
    )
    `).eq('id', id.value).single();

    if (error) {
      Logger.error(error, error.message);
      throw error;
    }

    return Album.HYDRATE(data);
  }

  async listByUserOwnerShallow(owner: UserIdValueObject): Promise<Album[]> {
    const { error, data } = await this.supabase.from('albums').select().eq('owner', owner.value);

    if (error) {
      Logger.error(error, `${AlbumRepository.name} ${this.listByUserOwnerShallow.name}: ${error.message}`);
      throw error;
    }

    return data.map(a => {
      return Album.HYDRATE({
        ...a,
        album_tag:   [],
        album_cards: []
      });
    });
  }

  async saveAlbum(album: Album) {
    const supabase = this.supabase;

    const { data: auth, error } = await supabase.auth.getUser();

    if (error) {
      Logger.error(error, error.message);
      throw error;
    }

    if (!auth.user) {
      throw new Error('User not authenticated');
    }

    const events = album.pullEvents();

    for (const e of events) {
      if (e instanceof AlbumCreatedEvent) {
        const { error: resultError } = await supabase.rpc('create_album', {
          album_name:  album.name.value,
          album_owner: album.owner.value,
          album_sets:  album.sets.value,
          album_tags:  album.tags.map(t => t.name.value)
        });

        if (resultError) {
          Logger.error(resultError, resultError.message);
          throw resultError;
        }
      }

      if (e instanceof AlbumCardAttachedEvent) {
        const resultCard = await supabase.from('album_cards').insert({
          quantity: 0,
          album_id: e.albumId,
          card_id: e.cardId,
        }).select().single();

        if (resultCard.error) {
          Logger.error(resultCard.error.message);
          throw resultCard.error;
        }

        await supabase.from('album_card_tags').insert(album.tags.map(t => ({
          album_card_id: resultCard.data.id,
          tag_id: t.id.value,
        })));
      }
    }

  }

  async addCard(idAlbum: IdValueObject, cardId: IdValueObject) {
    await this.supabase.from('album_cards').upsert({
      album_id: idAlbum.value,
      card_id:  cardId.value
    }, {
      onConflict: 'album_id,card_id'
    });
  }
}
