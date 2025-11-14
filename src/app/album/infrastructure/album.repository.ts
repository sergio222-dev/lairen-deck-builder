import type { SupabaseClient } from '@supabase/supabase-js';

import { AlbumCardAttachedEvent } from '~/app/album/domain/events/albumCardAttached.event';
import { AlbumChangesEvent }      from '~/app/album/domain/events/albumChangesEvent';
import { AlbumCreatedEvent }      from '~/app/album/domain/events/albumCreated.event';
import { AlbumCurrentChanged }    from '~/app/album/domain/events/albumCurrentChanged';
import { Album }                  from '~/app/album/domain/models/album.model';

import { TOKENS }               from '~/app/shared/binds/TOKENS';
import { NotFoundException }    from '~/app/shared/domain/exceptions/NotFound.exception';
import type { IdValueObject }   from '~/app/shared/domain/VO/Id.ValueObject';
import { UserIdValueObject }    from '~/app/shared/domain/VO/UserId.ValueObject';
import { POSTGREST_ERROR_CODE } from '~/app/shared/infrastructure/postgress/ErrorCode';

import { Logger } from '~/lib/logger';

import type { Database } from '../../../../database.types';

export class AlbumRepository {
  public static inject = [TOKENS.SUPABASE];

  constructor(private readonly supabase: SupabaseClient<Database, 'public'>) {
  }

  async getAlbumById(id: IdValueObject) {

    const { data: auth, error: authError } = await this.supabase.auth.getUser();

    if (authError) {
      Logger.error(authError);
      throw authError;
    }

    const ownerId = auth.user.id;

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
    `)
      .eq('id', id.value)
      .eq('owner', ownerId)
      // .order('cards.name', { referencedTable: 'album_cards', ascending: true })
      .single();

    if (error) {

      if (error.code === POSTGREST_ERROR_CODE.FOUND_ITEMS_DIFFERENT_OF_ONE) {
        const notFoundException = new NotFoundException(new UserIdValueObject(ownerId), id);
        Logger.error(notFoundException, notFoundException.message);

        throw notFoundException;
      }

      Logger.error(error);
      throw error;
    }

    // order cards by name
    return Album.HYDRATE(data);
  }

  async deleteAlbumById(id: IdValueObject) {
    const { data: auth, error: authError } = await this.supabase.auth.getUser();

    if (authError) {
      Logger.error(authError);
      throw authError;
    }

    await this.supabase.from('albums').delete().eq('id', id.value).eq('owner', auth.user.id);

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
          card_id:  e.cardId
        }).select().single();

        if (resultCard.error) {
          Logger.error(resultCard.error.message);
          throw resultCard.error;
        }

        await supabase.from('album_card_tags').insert(album.tags.map(t => ({
          album_card_id: resultCard.data.id,
          tag_id:        t.id.value
        })));
      }

      if (e instanceof AlbumCurrentChanged) {
        Logger.debug(e, 'AlbumCurrentChanged event');
        await supabase.from('albums').update({
          current: (e as AlbumCurrentChanged).currentValue
        })
          .eq('id', e.albumId);
      }

      if (e instanceof AlbumChangesEvent) {
        await supabase.rpc('album_update_changes', {
          changes: e.changes.map(c => ({
            album_id: album.id.value,
            card_id:  c.cardId,
            tag_id:   c.tagId,
            amount:   c.amount
          }))
        });
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
