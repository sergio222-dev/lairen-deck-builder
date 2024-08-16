import type { RequestEventBase, RequestEventLoader } from '@builder.io/qwik-city';
import type { SupabaseClient }                       from '@supabase/supabase-js';
import { createClient }                              from '@supabase/supabase-js';
import { CollectionTypes }                           from '~/config/collectionTypes';
import { Logger }                                    from '~/lib/logger';
import { createClientServer }                        from '~/lib/supabase-qwik';
import type { ImportDeckRequest }                    from "~/models/application/ImportCardItem";
import type { DeckCard, DeckItem, DeckState }        from '~/models/Deck';
import { on }                                        from "~/utils/go";
import type { NormalizedModel }                      from "~/utils/normalize";
import { denormalizeEntity, normalizeArray }         from "~/utils/normalize";
import type { Database }                             from '../../../database.types';

export class DeckRepository {
  private readonly supabase: SupabaseClient<Database>;
  private readonly supabaseClient: SupabaseClient<Database>;

  constructor(request: RequestEventLoader | RequestEventBase) {
    this.supabase = createClientServer(request);
    const url     = request.platform?.env?.['SB_API_URL'] ?? request.env.get('SB_API_URL');
    const secret  = request.platform?.env?.['SB_SECRET_ROLE'] ?? request.env.get('SB_SECRET_ROLE');

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

  public async saveDeck(data: DeckState): Promise<number> {

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
      ...data.splashArtId ? { deck_face: data.splashArtId } : {},
      ...data.id ? { id: data.id } : { created_at: (new Date()).toISOString() }
    })
      .select('id'); // get the id inserted

    if (error) {
      Logger.error(error, `${DeckRepository.name} ${this.saveDeck.name}`);
      return 0;
    }

    const deck      = data.masterDeck;
    const side      = data.sideDeck;
    const treasures = data.treasureDeck;

    const deckId = dataDeck[0].id;

    await this.insertDeckCollection(deckId, CollectionTypes.DECK, denormalizeEntity(deck));
    await this.insertDeckCollection(deckId, CollectionTypes.SIDE, denormalizeEntity(side));
    await this.insertDeckCollection(deckId, CollectionTypes.TREASURE, denormalizeEntity(treasures));

    return deckId;
  }

  public async getDeck(deckId: number, ownerId: string): Promise<DeckState | undefined> {
    const supabase = this.supabaseClient;

    // get the deck by id and check if the user is the owner
    const { data, error } = await supabase
      .from('decks')
      .select(`*, cards ( image )`)
      .eq('id', deckId)
      .eq('owner', ownerId)
      .single();

    if (error) {
      Logger.error(error, `${DeckRepository.name} ${this.getDeck.name}`);
      return undefined;
    }

    // get the collections
    const [deck, errorConvertion] = await on(this.convertDataToDeck(data));

    if (errorConvertion) {
      Logger.error(errorConvertion, `${DeckRepository.name} ${this.getDeck.name}`);
      return undefined;

    }

    return {
      ...deck,
      splashArt:   deck.splashArt ?? undefined,
      splashArtId: data.deck_face ?? undefined
    };
  }

  public async getPublicDeck(deckId: string): Promise<DeckState> {
    const supabase = this.supabaseClient;

    const { data, error } = await supabase
      .from('decks')
      .select(`*, cards ( image )`)
      .eq('id', deckId)
      .eq('is_public', true);

    if (error) {
      Logger.error(error, `${DeckRepository.name} ${this.getPublicDeck.name}`);
      throw new Error('Deck not found', { cause: error });
    }

    const [deck, errorConversion] = await on(this.convertDataToDeck(data[0]));

    if (errorConversion) {
      Logger.error(errorConversion, `${DeckRepository.name} ${this.getPublicDeck.name}`);
      throw new Error('Error converting deck', { cause: errorConversion });
    }

    return {
      ...deck,
      splashArt: deck.splashArt ?? undefined
    };
  }

  public async listPublicDecks(): Promise<DeckItem[]> {
    const supabase = this.supabaseClient;

    const { data, error } = await supabase
      .from('decks')
      .select('id, name, description, likes, cards ( image )')
      .eq('is_public', true)

    if (error) {
      Logger.error(error, `${DeckRepository.name} ${this.listPublicDecks.name}`);
      return [];
    }

    return data.map(d => {
      return {
        id:          d.id,
        name:        d.name,
        description: d.description,
        likes:       d.likes,
        splashArt:   d.cards?.image ?? undefined
      };
    });

  }

  public async listUserDecks(): Promise<DeckItem[]> {

    const { data: user, error: errorAuth } = await this.supabase.auth.getUser();

    if (errorAuth) {
      Logger.error(errorAuth, `${DeckRepository.name} ${this.listUserDecks.name}`);
      throw new Error('User not authenticated');
    }

    const supabase = this.supabaseClient;

    const { data, error } = await supabase
      .from('decks')
      .select(`*, cards ( image )`)
      .eq('owner', user.user!.id);

    if (error) {
      Logger.error(error, `${DeckRepository.name} ${this.listUserDecks.name}`);
      return [];
    }

    return data.map(d => ({
      id:          d.id,
      name:        d.name,
      description: d.description,
      likes:       d.likes,
      splashArt:   d.cards?.image ?? undefined,
    }));
  }

  public async getDeckByImport(importData: ImportDeckRequest): Promise<DeckState> {
    const supabase = this.supabaseClient;

    // fetch realm
    const { data: realm, error } = await supabase
      .from('cards')
      .select()
      .in('name', importData.realm.map(c => c.name))

    if (error) {
      Logger.error(error, `${DeckRepository.name} ${this.getDeckByImport.name}`);
      throw new Error('Deck not found', { cause: error });
    }

    // fetch treasure
    const { data: treasure, error: errorTreasure } = await supabase
      .from('cards')
      .select()
      .in('name', importData.treasure.map(c => c.name))

    if (errorTreasure) {
      Logger.error(errorTreasure, `${DeckRepository.name} ${this.getDeckByImport.name}`);
      throw new Error('Deck not found', { cause: errorTreasure });
    }

    // fetch side
    const { data: side, error: errorSide } = await supabase
      .from('cards')
      .select()
      .in('name', importData.side.map(c => c.name))

    if (errorSide) {
      Logger.error(errorSide, `${DeckRepository.name} ${this.getDeckByImport.name}`);
      throw new Error('Deck not found', { cause: errorSide });
    }

    const masterDeck: NormalizedModel<DeckCard>   = {};
    const sideDeck: NormalizedModel<DeckCard>     = {};
    const treasureDeck: NormalizedModel<DeckCard> = {};

    realm.forEach(c => {
      const card = importData.realm.find(i => i.name === c.name);

      if (card) {
        masterDeck[c.id] = {
          ...c,
          quantity: card.quantity
        }
      }
    });

    treasure.forEach(c => {
      const card = importData.treasure.find(i => i.name === c.name);

      if (card) {
        treasureDeck[c.id] = {
          ...c,
          quantity: card.quantity
        }
      }
    });

    side.forEach(c => {
      const card = importData.side.find(i => i.name === c.name);

      if (card) {
        sideDeck[c.id] = {
          ...c,
          quantity: card.quantity
        }
      }
    });

    return {
      masterDeck,
      sideDeck,
      treasureDeck,
      id:          0,
      name:        '',
      description: undefined,
      isPrivate:   false,
      likes:       0,
      splashArt:   undefined,
      splashArtId: undefined
    }
  }

  private async convertDataToDeck(data: Database['public']['Tables']['decks']['Row']): Promise<DeckState> {

    const supabase = this.supabaseClient;

    // get the collections
    const { data: deckCollectionData, error } = await supabase
      .from('collections_decks')
      .select()
      .eq('deck_id', data.id);

    if (error) {
      Logger.error(error, `${DeckRepository.name} ${this.convertDataToDeck.name}`);
      throw new Error('Deck not found', { cause: error });
    }

    let masterDeck: NormalizedModel<DeckCard>   = {};
    let sideDeck: NormalizedModel<DeckCard>     = {};
    let treasureDeck: NormalizedModel<DeckCard> = {};

    // get the main deck collection cards
    for (const deck of deckCollectionData) {
      const type = deck.type;

      const { data: cards } = await supabase
        .from('card_collection')
        .select('*, cards(*)')
        .eq('collection_id', deck.id);

      if (!cards) continue;

      const cardsData: DeckCard[] = [];

      cards.forEach(c => {
        const { cards: card } = c;

        if (card) {
          cardsData.push({
            ...card,
            image:    card.image,
            quantity: c.quantity,
          })
        }
      });

      switch (type) {
        case CollectionTypes.DECK:
          masterDeck = normalizeArray(cardsData);
          break;
        case CollectionTypes.SIDE:
          sideDeck = normalizeArray(cardsData);
          break;
        case CollectionTypes.TREASURE:
          treasureDeck = normalizeArray(cardsData);
          break;
        default:
          break;
      }
    }

    let deckFace: string | undefined = undefined;

    if (data.deck_face) {
      const { data: face, error: errorDeckFace } = await supabase
        .from('cards')
        .select()
        .eq('id', data.deck_face);

      if (errorDeckFace) {
        Logger.error(errorDeckFace, `${DeckRepository.name} ${this.convertDataToDeck.name}`);

      } else {
        deckFace = face[0].image;
      }
    }

    return {
      id:          data.id,
      name:        data.name,
      description: data.description ?? undefined,
      isPrivate:   data.is_public,
      likes:       data.likes,
      masterDeck,
      sideDeck,
      treasureDeck,
      splashArt:   deckFace,
      splashArtId: data.deck_face ?? undefined
    };
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

    await this.insertCards(cards);
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

  private async insertCards(cards: Database['public']['Tables']['card_collection']['Insert'][]) {
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
