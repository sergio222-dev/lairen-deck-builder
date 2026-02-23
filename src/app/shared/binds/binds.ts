import type { RequestEvent, RequestEventBase } from '@builder.io/qwik-city';
import type { SupabaseClient }                 from '@supabase/supabase-js';

import { AddCardToAlbum }                  from '~/app/album/application/addCardToAlbum';
import { CreateAlbum }                     from '~/app/album/application/createAlbum';
import { DeleteAlbum }                     from '~/app/album/application/deleteAlbum';
import type { AlbumFinder }                from '~/app/album/application/finder/album.finder';
import { GetAlbum }                        from '~/app/album/application/getAlbum';
import { GetAlbums }                       from '~/app/album/application/getAlbums';
import { GetAllCardAlbum }                 from '~/app/album/application/getAllCardAlbum';
import { SaveAlbumChanges }                from '~/app/album/application/saveAlbumChanges';
import { AlbumRepository }                 from '~/app/album/infrastructure/album.repository';
import { SupabaseAlbumFinder }             from '~/app/album/infrastructure/supabaseAlbum.finder';
import { AddCardToAlbumPresenter }         from '~/app/album/presenter/addCardToAlbum.presenter';
import { CreateAlbumPresenter }            from '~/app/album/presenter/createAlbum.presenter';
import { DeleteAlbumPresenter }            from '~/app/album/presenter/deleteAlbum.presenter';
import { GetAlbumsPresenter }              from '~/app/album/presenter/getAlbums.presenter';
import { GetAlbumViewStatePresenter }      from '~/app/album/presenter/getAlbumViewState.presenter';
import { SaveAlbumChangesPresenter }       from '~/app/album/presenter/saveAlbumChanges.presenter';
import { FindCard }                        from '~/app/card/application/findCard';
import type { CardFinder }                 from '~/app/card/application/finder/card.finder';
import type { CardFilterOptionsFinder }    from '~/app/card/application/finder/cardFilterOptions.finder';
import { GetAvailableSet }                 from '~/app/card/application/getAvailableSet';
import { GetCardById }                     from '~/app/card/application/getCardById';
import { GetCardFilterOptions }            from '~/app/card/application/getCardFilterOptions';
import { ImportDeckCards }                 from '~/app/card/application/importDeckCards';
import { QueryCards }                      from '~/app/card/application/queryCards';
import { DeckParserService }               from '~/app/card/application/serviecs/deckParser.service';
import CardRepository                      from '~/app/card/infrastructure/card.repository';
import { SetFinderRepository }             from '~/app/card/infrastructure/setFinder.repository';
import { SupabaseCardFinder }              from '~/app/card/infrastructure/supabaseCard.finder';
import { SupabaseCardFilterOptionsFinder } from '~/app/card/infrastructure/supabaseCardFilterOptions.finder';
import { FindCardByFiltersPresenter }      from '~/app/card/presenter/findCardByFilters.presenter';
import { GetAllFiltersOptionsPresenter }   from '~/app/card/presenter/getAllFiltersOptions.presenter';
import { GetCardByIdPresenter }            from '~/app/card/presenter/getCardByIdPresenter';
import { ImportDeckPresenter }             from '~/app/card/presenter/ImportDeck.presenter';
import { QueryCardsPresenter }             from '~/app/card/presenter/queryCards.presenter';
import { CreateDeck }                      from '~/app/deck/application/createDeck';
import { DeleteDeck }                 from '~/app/deck/application/deleteDeck';
import { GetDeck }                         from '~/app/deck/application/getDeck';
import { ListPublicDecks }                 from '~/app/deck/application/listPublicDecks';
import { ListUserDecks }                   from '~/app/deck/application/listUserDecks';
import { UpdateDeck }                      from '~/app/deck/application/updateDeck';
import { DeckRepository }                  from '~/app/deck/infrastructure/deck.repository';
import { DeleteDeckPresenter }        from '~/app/deck/presentation/deleteDeck.presenter';
import { GetDeckPresenter }                from '~/app/deck/presentation/getDeck.presenter';
import { ListPublicDeckPresenter }         from '~/app/deck/presentation/listPublicDeck.presenter';
import { ListUserDeckPresenter }           from '~/app/deck/presentation/listUserDeck.presenter';
import { SaveDeckPresenter }               from '~/app/deck/presentation/saveDeck.presenter';
import type { AuthService }                from '~/app/shared/application/auth.service';
import type { FlagsService }               from '~/app/shared/application/flags.service';
import { TOKENS }                          from '~/app/shared/binds/TOKENS';
import { GetCurrentUser }                  from '~/app/shared/infrastructure/getCurrentUser';
import { PgFlagService }                   from '~/app/shared/infrastructure/pgFlag.service';
import { SupabaseAuthService }             from '~/app/shared/infrastructure/supabaseAuth.service';

import { IoC }                from '~/lib/IoC';
import { Logger }             from '~/lib/logger';
import { createClientServer } from '~/lib/supabase-qwik';

export interface TOKEN_MAP {
  // values
  [TOKENS.REQUEST_CONTEXT]: RequestEvent | RequestEventBase;
  [TOKENS.CURRENT_USER]: ReturnType<typeof GetCurrentUser>;
  // services
  [TOKENS.SUPABASE]: SupabaseClient;
  [TOKENS.DECK_PARSER]: DeckParserService;
  [TOKENS.AUTH_SERVICE]: AuthService;
  [TOKENS.FLAG_SERVICE]: FlagsService;
  // finder
  [TOKENS.CARD_FINDER]: CardFinder;
  [TOKENS.ALBUM_FINDER]: AlbumFinder;
  [TOKENS.CARD_FILTER_OPTIONS_FINDER]: CardFilterOptionsFinder;
  // infrastructure
  [TOKENS.CARD_REPOSITORY]: CardRepository;
  [TOKENS.SET_FINDER_REPOSITORY]: SetFinderRepository;
  [TOKENS.ALBUM_REPOSITORY]: AlbumRepository;
  [TOKENS.DECK_REPOSITORY]: DeckRepository;
  // application
  [TOKENS.CREATE_ALBUM]: CreateAlbum;
  [TOKENS.GET_ALBUMS]: GetAlbums;
  [TOKENS.GET_ALBUM]: GetAlbum;
  [TOKENS.GET_AVAILABLE_SET]: GetAvailableSet;
  [TOKENS.QUERY_CARDS]: QueryCards;
  [TOKENS.ADD_CARD_TO_ALBUM]: AddCardToAlbum;
  [TOKENS.SAVE_CHANGES]: SaveAlbumChanges;
  [TOKENS.GET_CARD_BY_ID]: GetCardById;
  [TOKENS.DELETE_ALBUM]: DeleteAlbum;
  [TOKENS.DELETE_DECK]: DeleteDeck;
  [TOKENS.CREATE_DECK]: CreateDeck;
  [TOKENS.UPDATE_DECK]: UpdateDeck;
  [TOKENS.GET_DECK]: GetDeck;
  [TOKENS.LIST_USER_DECK]: ListUserDecks;
  [TOKENS.LIST_PUBLIC_DECK]: ListPublicDecks;
  [TOKENS.IMPORT_DECK]: ImportDeckCards;
  [TOKENS.GET_ALL_CARD_ALBUM]: GetAllCardAlbum;
  [TOKENS.GET_FILTER_OPTIONS]: GetCardFilterOptions;
  [TOKENS.FIND_CARDS]: FindCard;
  // presenter
  [TOKENS.CREATE_ALBUM_PRESENTER]: CreateAlbumPresenter;
  [TOKENS.QUERY_CARDS_PRESENTER]: QueryCardsPresenter;
  [TOKENS.ADD_CARD_TO_ALBUM_PRESENTER]: AddCardToAlbumPresenter;
  [TOKENS.GET_ALBUMS_PRESENTER]: GetAlbumsPresenter;
  [TOKENS.GET_ALBUM_VIEW_STATE_PRESENTER]: GetAlbumViewStatePresenter;
  [TOKENS.SAVE_CHANGES_PRESENTER]: SaveAlbumChangesPresenter;
  [TOKENS.GET_CARD_BY_ID_PRESENTER]: GetCardByIdPresenter;
  [TOKENS.DELETE_ALBUM_PRESENTER]: DeleteAlbumPresenter;
  [TOKENS.DELETE_DECK_PRESENTER]: DeleteDeckPresenter;
  [TOKENS.SAVE_DECK_PRESENTER]: SaveDeckPresenter;
  [TOKENS.GET_DECK_PRESENTER]: GetDeckPresenter;
  [TOKENS.LIST_USER_DECK_PRESENTER]: ListUserDeckPresenter;
  [TOKENS.LIST_PUBLIC_DECK_PRESENTER]: ListPublicDeckPresenter;
  [TOKENS.IMPORT_DECK_PRESENTER]: ImportDeckPresenter;
  [TOKENS.GET_ALL_FILTERS_OPTIONS_PRESENTER]: GetAllFiltersOptionsPresenter;
  [TOKENS.FIND_CARDS_PRESENTER]: FindCardByFiltersPresenter;
}

export function createContainer(req: RequestEvent) {
  IoC.instance
    // Values
    .provideValue(TOKENS.REQUEST_CONTEXT, req)
    .provideValue(TOKENS.CURRENT_USER, GetCurrentUser(req))
    // Services
    .provideValue(TOKENS.SUPABASE, createClientServer(req))
    .provide(TOKENS.DECK_PARSER, DeckParserService)
    .provide(TOKENS.AUTH_SERVICE, SupabaseAuthService)
    .provide(TOKENS.FLAG_SERVICE, PgFlagService)
    // Repositories
    .provide(TOKENS.ALBUM_REPOSITORY, AlbumRepository)
    .provide(TOKENS.CARD_REPOSITORY, CardRepository)
    .provide(TOKENS.SET_FINDER_REPOSITORY, SetFinderRepository)
    .provide(TOKENS.DECK_REPOSITORY, DeckRepository)
    // Finders
    .provide(TOKENS.CARD_FINDER, SupabaseCardFinder)
    .provide(TOKENS.ALBUM_FINDER, SupabaseAlbumFinder)
    .provide(TOKENS.CARD_FILTER_OPTIONS_FINDER, SupabaseCardFilterOptionsFinder)
    // Application Services
    .provide(TOKENS.CREATE_ALBUM, CreateAlbum)
    .provide(TOKENS.GET_ALBUMS, GetAlbums)
    .provide(TOKENS.GET_ALBUM, GetAlbum)
    .provide(TOKENS.GET_AVAILABLE_SET, GetAvailableSet)
    .provide(TOKENS.QUERY_CARDS, QueryCards)
    .provide(TOKENS.ADD_CARD_TO_ALBUM, AddCardToAlbum)
    .provide(TOKENS.SAVE_CHANGES, SaveAlbumChanges)
    .provide(TOKENS.GET_CARD_BY_ID, GetCardById)
    .provide(TOKENS.DELETE_ALBUM, DeleteAlbum)
    .provide(TOKENS.DELETE_DECK, DeleteDeck)
    .provide(TOKENS.CREATE_DECK, CreateDeck)
    .provide(TOKENS.UPDATE_DECK, UpdateDeck)
    .provide(TOKENS.GET_DECK, GetDeck)
    .provide(TOKENS.LIST_USER_DECK, ListUserDecks)
    .provide(TOKENS.LIST_PUBLIC_DECK, ListPublicDecks)
    .provide(TOKENS.IMPORT_DECK, ImportDeckCards)
    .provide(TOKENS.GET_ALL_CARD_ALBUM, GetAllCardAlbum)
    .provide(TOKENS.GET_FILTER_OPTIONS, GetCardFilterOptions)
    .provide(TOKENS.FIND_CARDS, FindCard)
    // Presenters
    .provide(TOKENS.CREATE_ALBUM_PRESENTER, CreateAlbumPresenter)
    .provide(TOKENS.GET_CARD_BY_ID_PRESENTER, GetCardByIdPresenter)
    .provide(TOKENS.QUERY_CARDS_PRESENTER, QueryCardsPresenter)
    .provide(TOKENS.ADD_CARD_TO_ALBUM_PRESENTER, AddCardToAlbumPresenter)
    .provide(TOKENS.GET_ALBUM_VIEW_STATE_PRESENTER, GetAlbumViewStatePresenter)
    .provide(TOKENS.GET_ALBUMS_PRESENTER, GetAlbumsPresenter)
    .provide(TOKENS.SAVE_CHANGES_PRESENTER, SaveAlbumChangesPresenter)
    .provide(TOKENS.DELETE_ALBUM_PRESENTER, DeleteAlbumPresenter)
    .provide(TOKENS.DELETE_DECK_PRESENTER, DeleteDeckPresenter)
    .provide(TOKENS.SAVE_DECK_PRESENTER, SaveDeckPresenter)
    .provide(TOKENS.GET_DECK_PRESENTER, GetDeckPresenter)
    .provide(TOKENS.LIST_USER_DECK_PRESENTER, ListUserDeckPresenter)
    .provide(TOKENS.LIST_PUBLIC_DECK_PRESENTER, ListPublicDeckPresenter)
    .provide(TOKENS.IMPORT_DECK_PRESENTER, ImportDeckPresenter)
    .provide(TOKENS.GET_ALL_FILTERS_OPTIONS_PRESENTER, GetAllFiltersOptionsPresenter)
    .provide(TOKENS.FIND_CARDS_PRESENTER, FindCardByFiltersPresenter);

  Logger.info(`Created container for ${req.method} ${req.pathname}`);
}
