import type { RequestEvent }          from '@builder.io/qwik-city';
import type { SupabaseClient }        from '@supabase/supabase-js';
import { AddCardToAlbum }             from '~/app/album/application/addCardToAlbum';
import { CreateAlbum }                from '~/app/album/application/createAlbum';
import { GetAlbum }                   from '~/app/album/application/getAlbum';
import { GetAlbums }                  from '~/app/album/application/getAlbums';
import { SaveAlbumChanges }           from '~/app/album/application/saveAlbumChanges';
import { AlbumRepository }            from '~/app/album/infrastructure/album.repository';
import { AddCardToAlbumPresenter }    from '~/app/album/presenter/AddCardToAlbumPresenter';
import { CreateAlbumPresenter }       from '~/app/album/presenter/createAlbumPresenter';
import { GetAlbumViewStatePresenter } from '~/app/album/presenter/getAlbumViewStatePresenter';
import { SaveAlbumChangesPresenter }  from '~/app/album/presenter/SaveAlbumChanges.presenter';
import { GetCardById }                from '~/app/card/application/getCardById';
import { QueryCards }                 from '~/app/card/application/queryCards';
import { CardRepository }             from '~/app/card/infrastructure/card.repository';
import { GetCardByIdPresenter }       from '~/app/card/presenter/getCardByIdPresenter';
import { QueryCardsPresenter }        from '~/app/card/presenter/queryCardsPresenter';
import { TOKENS }                     from '~/app/shared/binds/TOKENS';
import { GetCurrentUser }             from '~/app/user/application/getCurrentUser';
import { UserRepository }             from '~/app/user/infrastructure/user.repository';
import { IoC }                        from '~/lib/IoC';
import { Logger }                     from '~/lib/logger';
import { createClientServer }         from '~/lib/supabase-qwik';

export interface TOKEN_MAP {
  // services
  [TOKENS.SUPABASE]: SupabaseClient;
  // infrastructure
  [TOKENS.CARD_REPOSITORY]: CardRepository;
  [TOKENS.ALBUM_REPOSITORY]: AlbumRepository;
  [TOKENS.USER_REPOSITORY]: UserRepository;
  // application
  [TOKENS.CREATE_ALBUM]: CreateAlbum;
  [TOKENS.GET_ALBUMS]: GetAlbums;
  [TOKENS.GET_ALBUM]: GetAlbum;
  [TOKENS.GET_CURRENT_USER]: GetCurrentUser;
  [TOKENS.QUERY_CARDS]: QueryCards;
  [TOKENS.ADD_CARD_TO_ALBUM]: AddCardToAlbum;
  [TOKENS.SAVE_CHANGES]: SaveAlbumChanges;
  [TOKENS.GET_CARD_BY_ID]: GetCardById;
  // presenter
  [TOKENS.CREATE_ALBUM_PRESENTER]: CreateAlbumPresenter;
  [TOKENS.QUERY_CARDS_PRESENTER]: QueryCardsPresenter;
  [TOKENS.ADD_CARD_TO_ALBUM_PRESENTER]: AddCardToAlbumPresenter;
  [TOKENS.GET_ALBUM_VIEW_STATE_PRESENTER]: GetAlbumViewStatePresenter;
  [TOKENS.SAVE_CHANGES_PRESENTER]: SaveAlbumChangesPresenter;
  [TOKENS.GET_CARD_BY_ID_PRESENTER]: GetCardByIdPresenter;
}

export function createContainer(req: RequestEvent) {
  IoC.instance
    // Repositories
    .provide(TOKENS.ALBUM_REPOSITORY, AlbumRepository)
    .provide(TOKENS.USER_REPOSITORY, UserRepository)
    .provide(TOKENS.CARD_REPOSITORY, CardRepository)
    // Services
    .provideValue(TOKENS.SUPABASE, createClientServer(req))
    // Application Services
    .provide(TOKENS.CREATE_ALBUM, CreateAlbum)
    .provide(TOKENS.GET_ALBUMS, GetAlbums)
    .provide(TOKENS.GET_ALBUM, GetAlbum)
    .provide(TOKENS.GET_CURRENT_USER, GetCurrentUser)
    .provide(TOKENS.QUERY_CARDS, QueryCards)
    .provide(TOKENS.ADD_CARD_TO_ALBUM, AddCardToAlbum)
    .provide(TOKENS.SAVE_CHANGES, SaveAlbumChanges)
    .provide(TOKENS.GET_CARD_BY_ID, GetCardById)
    // Presenters
    .provide(TOKENS.CREATE_ALBUM_PRESENTER, CreateAlbumPresenter)
    .provide(TOKENS.GET_CARD_BY_ID_PRESENTER, GetCardByIdPresenter)
    .provide(TOKENS.QUERY_CARDS_PRESENTER, QueryCardsPresenter)
    .provide(TOKENS.ADD_CARD_TO_ALBUM_PRESENTER, AddCardToAlbumPresenter)
    .provide(TOKENS.GET_ALBUM_VIEW_STATE_PRESENTER, GetAlbumViewStatePresenter)
    .provide(TOKENS.SAVE_CHANGES_PRESENTER, SaveAlbumChangesPresenter);

  Logger.info(`Created container for ${req.method} ${req.pathname}`);
}
