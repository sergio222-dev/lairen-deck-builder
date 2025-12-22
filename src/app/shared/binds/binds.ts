import type { RequestEvent }   from '@builder.io/qwik-city';
import type { SupabaseClient } from '@supabase/supabase-js';

import { AddCardToAlbum }             from '~/app/album/application/addCardToAlbum';
import { CreateAlbum }                from '~/app/album/application/createAlbum';
import { DeleteAlbum }                from '~/app/album/application/deleteAlbum';
import type { AlbumFinder }           from '~/app/album/application/finder/albumFinder';
import { GetAlbum }                   from '~/app/album/application/getAlbum';
import { GetAlbums }        from '~/app/album/application/getAlbums';
import { GetAllCardAlbum }  from '~/app/album/application/getAllCardAlbum';
import { SaveAlbumChanges } from '~/app/album/application/saveAlbumChanges';
import { AlbumRepository }            from '~/app/album/infrastructure/album.repository';
import { SupabaseAlbumFinder }        from '~/app/album/infrastructure/SupabaseAlbumFinder';
import { AddCardToAlbumPresenter }    from '~/app/album/presenter/AddCardToAlbum.presenter';
import { CreateAlbumPresenter }       from '~/app/album/presenter/CreateAlbum.presenter';
import { DeleteAlbumPresenter }       from '~/app/album/presenter/DeleteAlbum.presenter';
import { GetAlbumsPresenter }         from '~/app/album/presenter/GetAlbums.presenter';
import { GetAlbumViewStatePresenter } from '~/app/album/presenter/GetAlbumViewState.presenter';
import { SaveAlbumChangesPresenter }  from '~/app/album/presenter/SaveAlbumChanges.presenter';
import type { CardFinder }            from '~/app/card/application/finder/Card.finder';
import { GetAvailableSet }            from '~/app/card/application/getAvailableSet';

import { GetCardById }          from '~/app/card/application/getCardById';
import { GetOwnedCards }        from '~/app/card/application/getOwnedCards';
import { ImportDeckCards }      from '~/app/card/application/importDeckCards';
import { QueryCards }           from '~/app/card/application/queryCards';
import { DeckParserService }    from '~/app/card/application/serviecs/DeckParser.service';
import { CardRepository }       from '~/app/card/infrastructure/card.repository';
import { SetFinderRepository }  from '~/app/card/infrastructure/setFinder.repository';
import { SupabaseCardFinder }   from '~/app/card/infrastructure/SupabaseCardFinder';
import { GetCardByIdPresenter } from '~/app/card/presenter/getCardByIdPresenter';
import { ImportDeckPresenter }  from '~/app/card/presenter/ImportDeck.presenter';
import { QueryCardsPresenter }  from '~/app/card/presenter/queryCardsPresenter';

import { CreateDeck }              from '~/app/deck/application/createDeck';
import { GetDeck }                 from '~/app/deck/application/getDeck';
import { ListPublicDecks }         from '~/app/deck/application/listPublicDecks';
import { ListUserDecks }           from '~/app/deck/application/listUserDecks';
import { UpdateDeck }              from '~/app/deck/application/updateDeck';
import { DeckRepository }          from '~/app/deck/infrastructure/deck.repository';
import { GetDeckPresenter }        from '~/app/deck/presentation/GetDeckPresenter';
import { ListPublicDeckPresenter } from '~/app/deck/presentation/ListPublicDeckPresenter';
import { ListUserDeckPresenter }   from '~/app/deck/presentation/ListUserDeckPresenter';
import { SaveDeckPresenter }       from '~/app/deck/presentation/SaveDeck.presenter';
import { FeatureFlag }             from '~/app/shared/application/FeatureFlag';

import { TOKENS }             from '~/app/shared/binds/TOKENS';
import { SupabaseFeatureFlag } from '~/app/shared/infrastructure/SupabaseFeatureFlag';
import { GetCurrentUser }     from '~/app/user/application/getCurrentUser';
import { UserRepository }     from '~/app/user/infrastructure/user.repository';
import { IoC }                from '~/lib/IoC';
import { Logger }             from '~/lib/logger';
import { createClientServer } from '~/lib/supabase-qwik';

export interface TOKEN_MAP {
  // services
  [TOKENS.SUPABASE]: SupabaseClient;
  [TOKENS.DECK_PARSER]: DeckParserService;
  [TOKENS.FEATURE_FLAG]: FeatureFlag;
  // finder
  [TOKENS.CARD_FINDER]: CardFinder;
  [TOKENS.ALBUM_FINDER]: AlbumFinder;
  // infrastructure
  [TOKENS.CARD_REPOSITORY]: CardRepository;
  [TOKENS.SET_FINDER_REPOSITORY]: SetFinderRepository;
  [TOKENS.ALBUM_REPOSITORY]: AlbumRepository;
  [TOKENS.USER_REPOSITORY]: UserRepository;
  [TOKENS.DECK_REPOSITORY]: DeckRepository;
  // application
  [TOKENS.CREATE_ALBUM]: CreateAlbum;
  [TOKENS.GET_ALBUMS]: GetAlbums;
  [TOKENS.GET_ALBUM]: GetAlbum;
  [TOKENS.GET_CURRENT_USER]: GetCurrentUser;
  [TOKENS.GET_AVAILABLE_SET]: GetAvailableSet;
  [TOKENS.QUERY_CARDS]: QueryCards;
  [TOKENS.ADD_CARD_TO_ALBUM]: AddCardToAlbum;
  [TOKENS.SAVE_CHANGES]: SaveAlbumChanges;
  [TOKENS.GET_CARD_BY_ID]: GetCardById;
  [TOKENS.DELETE_ALBUM]: DeleteAlbum;
  [TOKENS.GET_OWNED_CARDS]: GetOwnedCards;
  [TOKENS.CREATE_DECK]: CreateDeck;
  [TOKENS.UPDATE_DECK]: UpdateDeck;
  [TOKENS.GET_DECK]: GetDeck;
  [TOKENS.LIST_USER_DECK]: ListUserDecks;
  [TOKENS.LIST_PUBLIC_DECK]: ListPublicDecks;
  [TOKENS.IMPORT_DECK]: ImportDeckCards;
  [TOKENS.GET_ALL_CARD_ALBUM]: GetAllCardAlbum;
  // presenter
  [TOKENS.CREATE_ALBUM_PRESENTER]: CreateAlbumPresenter;
  [TOKENS.QUERY_CARDS_PRESENTER]: QueryCardsPresenter;
  [TOKENS.ADD_CARD_TO_ALBUM_PRESENTER]: AddCardToAlbumPresenter;
  [TOKENS.GET_ALBUMS_PRESENTER]: GetAlbumsPresenter;
  [TOKENS.GET_ALBUM_VIEW_STATE_PRESENTER]: GetAlbumViewStatePresenter;
  [TOKENS.SAVE_CHANGES_PRESENTER]: SaveAlbumChangesPresenter;
  [TOKENS.GET_CARD_BY_ID_PRESENTER]: GetCardByIdPresenter;
  [TOKENS.DELETE_ALBUM_PRESENTER]: DeleteAlbumPresenter;
  [TOKENS.SAVE_DECK_PRESENTER]: SaveDeckPresenter;
  [TOKENS.GET_DECK_PRESENTER]: GetDeckPresenter;
  [TOKENS.LIST_USER_DECK_PRESENTER]: ListUserDeckPresenter;
  [TOKENS.LIST_PUBLIC_DECK_PRESENTER]: ListPublicDeckPresenter;
  [TOKENS.IMPORT_DECK_PRESENTER]: ImportDeckPresenter;
}

export function createContainer(req: RequestEvent) {
  IoC.instance
    // Services
    .provideValue(TOKENS.SUPABASE, createClientServer(req))
    .provide(TOKENS.DECK_PARSER, DeckParserService)
    .provide(TOKENS.FEATURE_FLAG, SupabaseFeatureFlag)
    // Repositories
    .provide(TOKENS.ALBUM_REPOSITORY, AlbumRepository)
    .provide(TOKENS.USER_REPOSITORY, UserRepository)
    .provide(TOKENS.CARD_REPOSITORY, CardRepository)
    .provide(TOKENS.SET_FINDER_REPOSITORY, SetFinderRepository)
    .provide(TOKENS.DECK_REPOSITORY, DeckRepository)
    // Finders
    .provide(TOKENS.CARD_FINDER, SupabaseCardFinder)
    .provide(TOKENS.ALBUM_FINDER, SupabaseAlbumFinder)
    // Application Services
    .provide(TOKENS.CREATE_ALBUM, CreateAlbum)
    .provide(TOKENS.GET_ALBUMS, GetAlbums)
    .provide(TOKENS.GET_ALBUM, GetAlbum)
    .provide(TOKENS.GET_CURRENT_USER, GetCurrentUser)
    .provide(TOKENS.GET_AVAILABLE_SET, GetAvailableSet)
    .provide(TOKENS.QUERY_CARDS, QueryCards)
    .provide(TOKENS.ADD_CARD_TO_ALBUM, AddCardToAlbum)
    .provide(TOKENS.SAVE_CHANGES, SaveAlbumChanges)
    .provide(TOKENS.GET_CARD_BY_ID, GetCardById)
    .provide(TOKENS.DELETE_ALBUM, DeleteAlbum)
    .provide(TOKENS.GET_OWNED_CARDS, GetOwnedCards)
    .provide(TOKENS.CREATE_DECK, CreateDeck)
    .provide(TOKENS.UPDATE_DECK, UpdateDeck)
    .provide(TOKENS.GET_DECK, GetDeck)
    .provide(TOKENS.LIST_USER_DECK, ListUserDecks)
    .provide(TOKENS.LIST_PUBLIC_DECK, ListPublicDecks)
    .provide(TOKENS.IMPORT_DECK, ImportDeckCards)
    .provide(TOKENS.GET_ALL_CARD_ALBUM, GetAllCardAlbum)
    // Presenters
    .provide(TOKENS.CREATE_ALBUM_PRESENTER, CreateAlbumPresenter)
    .provide(TOKENS.GET_CARD_BY_ID_PRESENTER, GetCardByIdPresenter)
    .provide(TOKENS.QUERY_CARDS_PRESENTER, QueryCardsPresenter)
    .provide(TOKENS.ADD_CARD_TO_ALBUM_PRESENTER, AddCardToAlbumPresenter)
    .provide(TOKENS.GET_ALBUM_VIEW_STATE_PRESENTER, GetAlbumViewStatePresenter)
    .provide(TOKENS.GET_ALBUMS_PRESENTER, GetAlbumsPresenter)
    .provide(TOKENS.SAVE_CHANGES_PRESENTER, SaveAlbumChangesPresenter)
    .provide(TOKENS.DELETE_ALBUM_PRESENTER, DeleteAlbumPresenter)
    .provide(TOKENS.SAVE_DECK_PRESENTER, SaveDeckPresenter)
    .provide(TOKENS.GET_DECK_PRESENTER, GetDeckPresenter)
    .provide(TOKENS.LIST_USER_DECK_PRESENTER, ListUserDeckPresenter)
    .provide(TOKENS.LIST_PUBLIC_DECK_PRESENTER, ListPublicDeckPresenter)
    .provide(TOKENS.IMPORT_DECK_PRESENTER, ImportDeckPresenter);

  Logger.info(`Created container for ${req.method} ${req.pathname}`);
}
