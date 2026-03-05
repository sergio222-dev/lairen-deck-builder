import type { SupabaseClient } from '@supabase/supabase-js';
import { Album }               from '~/app/album/domain/models/album.model';

import { TOKENS }            from '~/app/shared/binds/TOKENS';
import { NotFoundException } from '~/app/shared/domain/exceptions/notFound.exception';
import { IdValueObject }     from '~/app/shared/domain/VO/id.valueObject';
import { UserIdValueObject }    from '~/app/shared/domain/VO/userId.valueObject';
import { POSTGREST_ERROR_CODE } from '~/app/shared/infrastructure/postgress/errorCode';

import { Logger } from '~/lib/logger';
import { Database } from '../../../../database.extension.types';


export class AlbumRepository {
  public static inject = [TOKENS.SUPABASE];

  constructor(private readonly supabase: SupabaseClient<Database, 'public'>) {
  }

  async getAlbumById(id: IdValueObject) {
    const { data, error } = await this.supabase
      .from('albums')
      .select(
        `
    id,
    name,
    sets,
    owner,
    total,
    current,
    album_tags:album_tags!album_tags_album_id_fkey (
      id,
      name
    )
    `
      )
      .eq('id', id.value)
      .limit(10000)
      // .order('cards.name', { referencedTable: 'album_cards', ascending: true })
      .single();


    if (error) {
      if (error.code === POSTGREST_ERROR_CODE.FOUND_ITEMS_DIFFERENT_OF_ONE) {
        const notFoundException = new NotFoundException(
          new UserIdValueObject(''),
          id
        );
        Logger.error(notFoundException, notFoundException.message);

        throw notFoundException;
      }

      Logger.error(error);
      throw error;
    }

    // order cards by name
    const { data: cards, error: cardsError} = await this.supabase.from('user_cards_by_album').select('*').order('name');

    if (cardsError) {
      Logger.error(error);

      throw cardsError;
    }

    return Album.HYDRATE({
      ...data,
      album_cards: cards.map(x => ({ cards: { id: x.card_id! }}))
    });
  }

  async deleteAlbumById(id: IdValueObject) {
    await this.supabase
      .from('albums')
      .delete()
      .eq('id', id.value)
  }

  async listByUserOwner(owner: UserIdValueObject): Promise<Album[]> {
    const { error, data } = await this.supabase
      .from('albums')
      .select()
      .eq('owner', owner.value);

    if (error) {
      Logger.error(
        error,
        `${AlbumRepository.name} ${this.listByUserOwner.name}: ${error.message}`
      );
      throw error;
    }

    return data.map((a) => {
      return Album.HYDRATE({
        ...a,
        album_cards: [],
        album_tags:  []
      });
    });
  }

  async saveAlbum(album: Album): Promise<IdValueObject> {
    let idAlbum = album.id;

    if (album.id.value === 0) {
      const { data: albumCreationResult, error: albumCreationError } =
              await this.supabase.rpc('album_create', {
                album_name: album.name.value,
                album_sets: album.sets.value,
                album_tags: album.tags.map((t) => t.name.value)
              });

      if (albumCreationError) {
        Logger.error(albumCreationError);
        throw albumCreationError;
      }

      if (albumCreationResult) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        idAlbum = new IdValueObject(albumCreationResult);
      }
    } else {
      const { error: albumUpdateError } = await this.supabase.rpc(
        'album_update_quantity',
        {
          album_changes: album.changes.map((c) => ({
            album_id: album.id.value,
            card_id:  c.props.cardId.value,
            tag_id:   c.props.tagId.value,
            amount:   c.props.amount.value
          }))
        }
      );

      if (albumUpdateError) {
        Logger.error(albumUpdateError);
        throw albumUpdateError;
      }
    }

    return idAlbum;
  }

}
