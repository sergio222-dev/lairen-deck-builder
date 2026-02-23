import type { MergeDeep }                from 'type-fest';
import type { Database as MainDatabase } from './database.types';
import type { DeckSaveRpc_Deck_Data }    from '~/app/deck/infrastructure/deckSaveRpcDeckData';

export type Database = MergeDeep<MainDatabase, {
  public: {
    Functions: {
      deck_save: { Args: { deck_data: DeckSaveRpc_Deck_Data }; Returns: number }
    }
  }
}>
