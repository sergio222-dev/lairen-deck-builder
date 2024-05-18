import { RequestEventBase, RequestEventLoader, z } from '@builder.io/qwik-city';
import { SupabaseClient, createClient }            from '@supabase/supabase-js';
import { CollectionTypes }                         from '~/config/collectionTypes';
import { DeckNotFoundException }                   from '~/exceptions/DeckNotFoundException';
import { UnauthorizedException }                   from '~/exceptions/UnauthorizedException';
import { Logger }                                  from '~/lib/logger';
import { createClientServer }                                 from '~/lib/supabase-qwik';
import { CardDeck, Deck, MasterDeck, SideDeck, TreasureDeck } from '~/models/Deck';
import { createDeckRequest }                                  from '~/models/schemes/createDeckRequest';
import { Database }                                from '../../../database.types';

export class DeckRepository {
  private readonly supabase: SupabaseClient<Database>;
  private readonly supabaseClient: SupabaseClient<Database>;

  constructor(request: RequestEventLoader | RequestEventBase) {
    this.supabase = createClientServer(request);
    const url     = request.env.get('SB_API_URL');
    const secret  = request.env.get('SB_SECRET_ROLE');

    if (!url || !secret) {
      Logger.error('The ENV variables SB_API_URL and SB_SECRET_ROLE are not setted');
      throw new Error('The ENV variables SB_API_URL and SB_SECRET_ROLE are not setted');
    }

    this.supabaseClient = createClient(url, secret, {
      auth: {
        persistSession:     false,
        autoRefreshToken:   false,
        detectSessionInUrl: false
      }
    });
  }

  public async saveDeck(data: z.infer<typeof createDeckRequest>): Promise<number> {

    const supabase       = this.supabase;
    const supabaseClient = this.supabaseClient;
    const { data: auth } = await supabase.auth.getUser();

    if (!auth.user) {
      Logger.error('User not authenticated', `${DeckRepository.name} ${this.saveDeck.name}`);
      throw new Error('User not authenticated');
    }

    // check if the deck is owned by the user
    if (data.id) {
      const { data: decks } = await supabaseClient.from('decks').select().eq('owner', auth.user.id);

      if (!decks) {
        Logger.error('Deck is not owned by the user', `${DeckRepository.name} ${this.saveDeck.name}`);
        throw new Error('Deck is not owned by the user');
      }
    }


    const { error, data: dataDeck } = await supabaseClient.from('decks').upsert({
      name:        data.name,
      description: data.description,
      updated_at:  (new Date()).toISOString(),
      owner:       auth.user.id,
      is_public:   data.isPrivate, // TODO: change the column name to is_private
      likes:       0,
      ...data.id ? { id: data.id } : { created_at: (new Date()).toISOString() }
    })
      .select('id'); // get the id inserted

    if (error) {
      Logger.error(error, `${DeckRepository.name} ${this.saveDeck.name}`);
      return 0;
    }

    const deck      = data.deck;
    const side      = data.side;
    const treasures = data.treasures;

    const deckId = dataDeck[0].id;

    await this.insertDeckCollection(deckId, CollectionTypes.DECK, deck);
    await this.insertDeckCollection(deckId, CollectionTypes.SIDE, side);
    await this.insertDeckCollection(deckId, CollectionTypes.TREASURE, treasures);

    return deckId;
  }

  public async getDeck(deckId: number, ownerId: string): Promise<Deck | undefined> {
    const supabase = this.supabaseClient;

    // get the deck by id and check if the user is the owner
    const { data, error } = await supabase
      .from('decks')
      .select()
      .eq('id', deckId)
      .eq('owner', ownerId);

    if (error) {
      Logger.error(error, `${DeckRepository.name} ${this.getDeck.name}`);
      return undefined;
    }

    if (!data) {
      throw new DeckNotFoundException("Deck not found");
    }

    const deck = data[0];

    // get the collections
    const { data: deckCollectionData } = await supabase
      .from('collections_decks')
      .select()
      .eq('deck_id', deckId);

    if (!deckCollectionData) {
      return undefined;
    }

    let masterDeck: MasterDeck = {
      id:       0,
      cards:    []
    };
    let sideDeck: SideDeck = {
      id:       0,
      cards:    []
    };
    let treasureDeck: TreasureDeck = {
      id:       0,
      cards:    []
    };


    // get the main deck collection cards
    for (const deck of deckCollectionData) {
      const type = deck.type;

      const { data: cards } = await supabase
        .from('card_collection')
        .select()
        .eq('collection_id', deck.id);

      if (!cards) continue;

      const cardsData = cards.map<CardDeck>(c => {
        return {
          id:       c.card_id,
          quantity: c.quantity
        };
      });

      switch (type) {
        case CollectionTypes.DECK:
          masterDeck = {
            id:       deck.id,
            cards:    cardsData
          };
          break;
        case CollectionTypes.SIDE:
          sideDeck = {
            id:       deck.id,
            cards:    cardsData
          };
          break;
        case CollectionTypes.TREASURE:
          treasureDeck = {
            id:       deck.id,
            cards:    cardsData
          };
          break;
        default:
          break;
      }
    }

    return {
      id:       deck.id,
      name:     deck.name,
      description: deck.description ?? undefined,
      isPrivate: deck.is_public,
      likes:    deck.likes,
      masterDeck,
      sideDeck,
      treasureDeck
    }

  }

  private async insertDeckCollection(
    deckId: number,
    collection: CollectionTypes,
    deck: { id: number, quantity: number }[]
  ) {
    const collectionId = await this.insertCollection(deckId, collection);

    if (collectionId === -1) {
      return;
    }

    const cards: Database['public']['Tables']['card_collection']['Insert'][] = deck.map(card => {
      return {
        card_id:       card.id,
        collection_id: collectionId,
        quantity:      card.quantity
      };
    });

    await this.insertCards(cards, collectionId);
  }

  private async insertCollection(deckId: number, type: CollectionTypes): Promise<number> {
    const supabase = this.supabaseClient;

    const { error, data: dekCollectionData } = await supabase.from('collections_decks')
      .insert({
        deck_id: deckId,
        type
      })
      .select('id');

    if (error) {
      Logger.error(error, `${DeckRepository.name} ${this.insertCollection.name}`);
      return -1;
    }

    return dekCollectionData[0].id;
  }

  private async insertCards(cards: Database['public']['Tables']['card_collection']['Insert'][], collectionId: number) {
    const supabase = this.supabaseClient;

    const { error } = await supabase
      .from('card_collection')
      .insert(cards);

    if (error) {
      Logger.error(error, `${DeckRepository.name} ${this.insertCards.name}`);
      return;
    }
  }
}
