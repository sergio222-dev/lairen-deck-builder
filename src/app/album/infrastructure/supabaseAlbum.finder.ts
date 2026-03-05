import type { SupabaseClient }           from '@supabase/supabase-js';
import type { AlbumFinder }              from '~/app/album/application/finder/album.finder';
import { AlbumProjection }               from '~/app/album/application/projection/album.projection';
import type { AlbumCardProjection }      from '~/app/album/application/projection/albumCard.projection';
import { AlbumCardWithCursorProjection } from '~/app/album/application/projection/albumCardWithTags.projection';
import { AlbumStatsProjection }          from '~/app/album/application/projection/albumStats.projection';
import { TOKENS }                        from '~/app/shared/binds/TOKENS';
import { NotFoundException }             from '~/app/shared/domain/exceptions/notFound.exception';
import { IdValueObject }                 from '~/app/shared/domain/VO/id.valueObject';
import { StringValueObject }             from '~/app/shared/domain/VO/string.valueObject';
import { UserIdValueObject }             from '~/app/shared/domain/VO/userId.valueObject';
import { Logger }                        from '~/lib/logger';
import { normalize }                     from '~/utils/normalize';
import type { Database }                 from '../../../../database.extension.types';

export class SupabaseAlbumFinder implements AlbumFinder {
  static readonly inject = [TOKENS.SUPABASE];

  constructor(private readonly supabase: SupabaseClient<Database, 'public'>) {
  }

  async getAlbumStats(albumId: IdValueObject): Promise<AlbumStatsProjection> {
    const { data, error } = await this
      .supabase
      .from('user_card_tag_by_album')
      .select('*')
      .eq('album_id', albumId.value);

    if (error) {
      Logger.error(error, `Class: ${SupabaseAlbumFinder.name}, Method: ${this.getAlbumStats.name}`);
      throw error;
    }

    if (!data)
      return {
        stats: []
      };

    return {
      stats: data.map(x => ({
        id:    x.id!,
        name:  x.name!,
        total: x.total!
      }))
    };
  }

  async findAlbumProjection(ownerId: UserIdValueObject, albumId: IdValueObject): Promise<AlbumProjection> {
    const { data, error } = await this.supabase.from('albums')
      .select('*, album_tags!album_tags_album_id_fkey ( name )')
      .eq('id', albumId.value)
      .eq('owner', ownerId.value)
      .single();

    if (error) {
      Logger.error(error, `Class: ${SupabaseAlbumFinder.name}, Method: ${this.findAlbumProjection.name}`);
      throw error;
    }

    if (!data) throw new NotFoundException(ownerId, albumId);

    return {
      name:    data.name,
      sets:    data.sets,
      current: data.current,
      total:   data.total,
      id:      data.id,
      tags:    data.album_tags.map(tag => tag.name)
    };
  }

  async findAlbumCardProjection(albumId: IdValueObject,
                                query: StringValueObject,
                                cursor: StringValueObject | null): Promise<AlbumCardWithCursorProjection> {
    const { data, error } = await this.supabase.rpc('get_albums_cards', {
      p_album_id: albumId.value,
      p_cursor:   cursor?.value,
      p_query: query.value,
    });

    if (error) {
      Logger.error(error, `Class: ${SupabaseAlbumFinder.name}, Method: ${this.findAlbumCardProjection.name}`);
    }

    if (!data) {
      return {
        cursor:      null,
        album_cards: []
      };
    }

    return {
      cursor:      data.cursor,
      album_cards: data.album_cards?.map(a => ({
        id:    a.id,
        name:  a.name,
        image: a.image,
        tags:  a.tags.map(t => ({
          quantity: t.quantity,
          name:     t.name,
          id:       t.id
        }))
      })) ?? []
    };
  }

  async findMissingCardInfoProjection(ownerId: UserIdValueObject,
                                      albumId: IdValueObject): Promise<AlbumCardProjection[]> {
    const { data: albumData, error: albumError } = await this.supabase
      .from('albums')
      .select('*')
      .eq('owner', ownerId.value)
      .eq('id', albumId.value)
      .single();

    if (albumError) {
      throw albumError;
    }

    const sets = albumData.sets;

    const { data: cardsInAlbum, error: cardsAlbumError } = await this.supabase.from('album_cards').select(`
    *, albums ( owner, id, sets )
    `).eq('albums.owner', ownerId.value)
      .eq('albums.id', albumId.value);

    if (cardsAlbumError) {
      throw cardsAlbumError;
    }

    const normalizedCardsInAlbum = normalize('album_id', cardsInAlbum);

    const { data: cards, error: cardsError } = await this.supabase.from('cards')
      .select('*')
      .in('set', sets);

    if (cardsError) {
      throw cardsError;
    }

    const reducedCards = cards.reduce((acc, card) => {
      if (normalizedCardsInAlbum[card.id]) {
        acc[card.id] = 4 - normalizedCardsInAlbum[card.id].quantity;
      } else {
        acc[card.id] = 4;
      }

      return acc;
    }, {} as Record<number, number>);


    return Object.entries(reducedCards).map<AlbumCardProjection>(([id, quantity]) => {
      return {
        id: parseInt(id),
        quantity
      };
    });
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
