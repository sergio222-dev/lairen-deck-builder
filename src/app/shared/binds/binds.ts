import type { RequestEvent }       from '@builder.io/qwik-city';
import type { SupabaseClient }     from '@supabase/supabase-js';
import { AddCardToAlbum }          from '~/app/album/application/addCardToAlbum';
import { CreateAlbum }             from '~/app/album/application/createAlbum';
import { GetAlbum }                from '~/app/album/application/getAlbum';
import { GetAlbums }               from '~/app/album/application/getAlbums';
import { AlbumRepository }         from '~/app/album/infrastructure/album.repository';
import { AddCardToAlbumPresenter } from '~/app/album/presenter/AddCardToAlbumPresenter';
import { CreateAlbumPresenter }    from '~/app/album/presenter/createAlbumPresenter';
import { QueryCards }              from '~/app/card/application/queryCards';
import { CardRepository }          from '~/app/card/infrastructure/card.repository';
import { QueryCardsPresenter }     from '~/app/card/presenter/queryCardsPresenter';
import { TOKENS }                  from '~/app/shared/binds/TOKENS';
import { GetCurrentUser }          from '~/app/user/application/getCurrentUser';
import { UserRepository }          from '~/app/user/infrastructure/user.repository';
import { IoC }                     from '~/lib/IoC';
import { Logger }                  from '~/lib/logger';
import { createClientServer }      from '~/lib/supabase-qwik';

export interface TOKEN_MAP {
  // services
  [TOKENS.SUPABASE]: SupabaseClient;
  // application
  [TOKENS.CREATE_ALBUM]: CreateAlbum;
  [TOKENS.GET_ALBUMS]: GetAlbums;
  [TOKENS.GET_ALBUM]: GetAlbum;
  [TOKENS.GET_CURRENT_USER]: GetCurrentUser;
  [TOKENS.QUERY_CARDS]: QueryCards;
  [TOKENS.ADD_CARD_TO_ALBUM]: AddCardToAlbum;
  // infrastructure
  [TOKENS.CARD_REPOSITORY]: CardRepository;
  [TOKENS.ALBUM_REPOSITORY]: AlbumRepository;
  [TOKENS.USER_REPOSITORY]: UserRepository;
  // presenter
  [TOKENS.CREATE_ALBUM_PRESENTER]: CreateAlbumPresenter;
  [TOKENS.QUERY_CARDS_PRESENTER]: QueryCardsPresenter;
  [TOKENS.ADD_CARD_TO_ALBUM_PRESENTER]: AddCardToAlbumPresenter;
}

export function createContainer(req: RequestEvent) {
  IoC.instance
    // Services
    .provideValue(TOKENS.SUPABASE, createClientServer(req))
    // Application Services
    .provide(TOKENS.CREATE_ALBUM, CreateAlbum)
    .provide(TOKENS.GET_ALBUMS, GetAlbums)
    .provide(TOKENS.GET_ALBUM, GetAlbum)
    .provide(TOKENS.GET_CURRENT_USER, GetCurrentUser)
    .provide(TOKENS.QUERY_CARDS, QueryCards)
    .provide(TOKENS.ADD_CARD_TO_ALBUM, AddCardToAlbum)
    // Repositories
    .provide(TOKENS.ALBUM_REPOSITORY, AlbumRepository)
    .provide(TOKENS.USER_REPOSITORY, UserRepository)
    .provide(TOKENS.CARD_REPOSITORY, CardRepository)
    // Presenters
    .provide(TOKENS.CREATE_ALBUM_PRESENTER, CreateAlbumPresenter)
    .provide(TOKENS.QUERY_CARDS_PRESENTER, QueryCardsPresenter)
    .provide(TOKENS.ADD_CARD_TO_ALBUM_PRESENTER, AddCardToAlbumPresenter);

  Logger.info(`Created container for ${req.method} ${req.pathname}`);
}
