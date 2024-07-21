import type { RequestEventBase, RequestEventLoader } from '@builder.io/qwik-city';
import type { SupabaseClient }                       from '@supabase/supabase-js';
import { createClient }                              from '@supabase/supabase-js';
import { CollectionTypes }                           from '~/config/collectionTypes';
import { Logger }                                    from '~/lib/logger';
import { createClientServer }                        from '~/lib/supabase-qwik';
import type { DeckCard, DeckItem, DeckState }        from '~/models/Deck';
import { getCardImageUrl }                           from "~/utils/cardImage";
import { on }                                        from "~/utils/go";
import type { NormalizedModel }                      from "~/utils/normalize";
import { denormalizeEntity, normalizeArray }         from "~/utils/normalize";
import type { Database }                             from '../../../database.types';

export class DeckRepository {
  private readonly supabase: SupabaseClient<Database>;
  private readonly supabaseClient: SupabaseClient<Database>;
  private readonly request: RequestEventLoader | RequestEventBase;

  constructor(request: RequestEventLoader | RequestEventBase) {
    this.request  = request;
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
      .select()
      .eq('id', deckId)
      .eq('owner', ownerId);

    if (error) {
      Logger.error(error, `${DeckRepository.name} ${this.getDeck.name}`);
      return undefined;
    }

    // get the collections
    const [deck, errorConvertion] = await on(this.convertDataToDeck(data[0]));

    if (errorConvertion) {
      Logger.error(errorConvertion, `${DeckRepository.name} ${this.getDeck.name}`);
      return undefined;

    }

    return deck;
  }

  public async getPublicDeck(deckId: string): Promise<DeckState> {
    const supabase = this.supabaseClient;

    const { data, error } = await supabase
      .from('decks')
      .select()
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

    return deck;
  }

  public async listPublicDecks(): Promise<DeckItem[]> {
    const supabase = this.supabaseClient;

    const { data, error } = await supabase
      .from('decks')
      .select('id, name, description, likes')
      .eq('is_public', true)

    if (error) {
      Logger.error(error, `${DeckRepository.name} ${this.listPublicDecks.name}`);
      return [];
    }

    return data.map(d => ({
      id:          d.id,
      name:        d.name,
      description: d.description,
      likes:       d.likes,
    }));

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
            image:    getCardImageUrl(card.image + '.webp', this.request),
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

    return {
      id:          data.id,
      name:        data.name,
      description: data.description ?? undefined,
      isPrivate:   data.is_public,
      likes:       data.likes,
      masterDeck,
      sideDeck,
      treasureDeck
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
