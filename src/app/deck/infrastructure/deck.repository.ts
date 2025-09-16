import type { RequestEventBase, RequestEventLoader }                    from '@builder.io/qwik-city';
import type { SupabaseClient }                                          from '@supabase/supabase-js';
import type { DeckCardInfo, DeckInfo, DeckModel }                       from '~/app/deck/models/deck.model';
import { Logger }                                                       from '~/lib/logger';
import { createClientServer }                                           from '~/lib/supabase-qwik';
import type { ImportDeckRequest }                                       from '~/models/application/ImportCardItem';
import { CARD_TYPES }                                                   from '~/models/CardTypes';
import type { DeckCard, DeckData, DeckItem, DeckState, PublicDeckItem } from '~/models/Deck';
import { on }                                                           from '~/utils/go';
import type { NormalizedModel }                                         from '~/utils/normalize';
import { normalizeArray }                                               from '~/utils/normalize';
import type { Database, Tables }                                        from '../../../../database.types';

export class DeckRepository {
  private readonly supabase: SupabaseClient<Database, 'public'>;

  constructor(request: RequestEventLoader | RequestEventBase) {
    this.supabase = createClientServer(request);
  }

  public async fetchDeck(id: number): Promise<DeckModel> {
    const supabase = this.supabase;

    const { data, error } = await supabase.from('decks').select().eq('id', id).single();

    if (error) {
      Logger.error(error, `Error fetching deck`);
      throw new Error(`Error fetching dekck`, { cause: error });
    }

    const { data: cards, error: cardError } = await supabase.from('deck_card').select().eq('deck', data.id);

    if (cardError) {
      Logger.error(cardError, `Error fetching deck cards`, cardError);
      throw new Error(`Error fetching deck cards`, cardError);
    }

    const deckCards: DeckCardInfo[] = cards.map<DeckCardInfo>(c => ({
      id:                 c.card!,
      quantity:           c.quantity!,
      quantityInSideDeck: c.quantity_side!
    }));

    return {
      id:          data.id,
      name:        data.name,
      description: data.description,
      isPublic:    data.is_public,
      type1:       data.type_1,
      type2:       data.type_2,
      splashArtId: data.deck_face,
      cards:       deckCards
    };
  }

  public async listPublicDeck(): Promise<DeckInfo[]> {
    const supabase = this.supabase;

    const { data, error } = await supabase.from('decks').select().eq('is_public', true);

    if (error) {
      Logger.error(error, `Error fetching public decks`);
      throw new Error(`Error fetching deck cards`, { cause: error });
    }

    return data.map(d => ({
      id:          d.id,
      name:        d.name,
      description: d.description,
      type1:       d.type_1,
      type2:       d.type_2,
      splashArtId: d.deck_face,
      isPublic:    d.is_public
    }));
  }

  public async saveDeck(deck: DeckData): Promise<number> {

    const supabase       = this.supabase;
    const { data: auth } = await supabase.auth.getUser();

    if (!auth.user) {
      Logger.error(`User not authenticated ${DeckRepository.name} ${this.saveDeck.name}`);
      throw new Error('User not authenticated');
    }

    // check if the deck is owned by the user
    if (deck.id) {
      const { data: decks } = await supabase.from('decks').select().eq('owner', auth.user.id);

      if (!decks) {
        Logger.error(`Deck is not owned by the user ${DeckRepository.name} ${this.saveDeck.name}`);
        throw new Error('Deck is not owned by the user');
      }
    }


    // UPDATE DECK INFORMATION
    const { error, data: dataDeck } = await supabase.from('decks').upsert({
      name:        deck.name,
      description: deck.description,
      updated_at:  (new Date()).toISOString(),
      owner:       auth.user.id,
      is_public:   deck.isPublic,
      likes:       0,
      type1:       deck.type1,
      type2:       deck.type2,
      // ...deck.splashArtId ? { deck_face: deck. } : {},
      ...deck.id ? { id: deck.id } : { created_at: (new Date()).toISOString() }
    })
      .select('id'); // get the id inserted

    if (error) {
      Logger.error(error, `${DeckRepository.name} ${this.saveDeck.name}`);
      throw new Error('Deck save error', { cause: error });
    }

    const deckId = dataDeck[0].id;

    // UPDATE DECK CARDS
    await supabase.from('deck_card')
      .upsert(Object.values(deck.cardStack).map<Tables<'deck_card'>>(c => ({
        deck:          deckId,
        card:          c.id,
        quantity:      c.quantity,
        quantity_side: c.quantityInSideDeck
      })));

    // await this.insertDeckCollection(deckId, CollectionTypes.DECK, denormalizeEntity(deck));
    // await this.insertDeckCollection(deckId, CollectionTypes.SIDE, denormalizeEntity(side));
    // await this.insertDeckCollection(deckId, CollectionTypes.TREASURE, denormalizeEntity(treasures));

    return deckId;
  }

  public async deleteDeck(deckId: number): Promise<void> {

    const supabase = this.supabase;

    const { data: auth } = await supabase.auth.getUser();

    if (!auth.user) {
      Logger.error(`User not authenticated ${DeckRepository.name} ${this.deleteDeck.name}`);
      throw new Error('User not authenticated');
    }

    const { error } = await supabase.from('decks').delete().eq('id', deckId);

    if (error) {
      Logger.error(error, `${DeckRepository.name} ${this.deleteDeck.name}`);
      return;
    }
  }

  public async getDeck(deckId: number, ownerId: string): Promise<DeckData | undefined> {
    const supabase = this.supabase;

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
      splashArt: deck.splashArt ?? undefined
      // splashArtId: data.deck_face ?? undefined
    };
  }

  public async getPublicDeck(deckId: number): Promise<DeckData> {
    const supabase = this.supabase;

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
      ...deck
    };
  }

  public async listPublicDecks(): Promise<PublicDeckItem[]> {
    const supabase = this.supabase;

    const { data, error } = await supabase
      .from('decks')
      .select('id, name, description, cards ( image )')
      .eq('is_public', true);

    if (error) {
      Logger.error(error, `${DeckRepository.name} ${this.listPublicDecks.name}`);
      return [];
    }

    return data.map(d => {
      return {
        id:          d.id,
        name:        d.name,
        description: d.description,
        splashArt:   d.cards?.image ?? undefined
      };
    });

  }

  public async listUserDecks(): Promise<DeckItem[]> {

    const supabase = this.supabase;

    const { data: user, error: errorAuth } = await supabase.auth.getUser();

    if (errorAuth) {
      Logger.error(errorAuth, `${DeckRepository.name} ${this.listUserDecks.name}`);
      throw new Error('User not authenticated', { cause: errorAuth });
    }

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
      splashArt:   d.cards?.image ?? undefined,
      type1:       d.type_1,
      type2:       d.type_2,
      isPublic:    d.is_public
    }));
  }

  public async getDeckByImport(importData: ImportDeckRequest): Promise<DeckState> {
    const supabase = this.supabase;

    // fetch realm
    const { data: realm, error } = await supabase
      .from('cards')
      .select()
      .in('name', importData.realm.map(c => c.name));

    if (error) {
      Logger.error(error, `${DeckRepository.name} ${this.getDeckByImport.name}`);
      throw new Error('Deck not found', { cause: error });
    }

    // fetch treasure
    const { data: treasure, error: errorTreasure } = await supabase
      .from('cards')
      .select()
      .in('name', importData.treasure.map(c => c.name));

    if (errorTreasure) {
      Logger.error(errorTreasure, `${DeckRepository.name} ${this.getDeckByImport.name}`);
      throw new Error('Deck not found', { cause: errorTreasure });
    }

    // fetch side
    const { data: side, error: errorSide } = await supabase
      .from('cards')
      .select()
      .in('name', importData.side.map(c => c.name));

    if (errorSide) {
      Logger.error(errorSide, `${DeckRepository.name} ${this.getDeckByImport.name}`);
      throw new Error('Deck not found', { cause: errorSide });
    }

    // create card stack
    const cardStack: NormalizedModel<DeckCard> = {};

    const normalizedRealmImportData = importData.realm
      .reduce<Record<string, { name: string, quantity: number }>>((a,
                                                                   c) => {
        a[c.name] = { ...c };
        return a;
      }, {});

    const normalizedTreasureImportData = importData.treasure.reduce<Record<string, { name: string, quantity: number }>>(
      (a, c) => {
        a[c.name] = { ...c };
        return a;
      },
      {});

    const normalizedSideImportData = importData.side.reduce<Record<string, { name: string, quantity: number }>>((a,
                                                                                                                 c) => {
      a[c.name] = { ...c };
      return a;
    }, {});

    realm.forEach(c => {
      const quantity  = normalizedRealmImportData[c.name].quantity;
      cardStack[c.id] = {
        ...c,
        quantity,
        quantityInSideDeck: 0
      };
    });

    treasure.forEach(c => {
      const quantity  = normalizedTreasureImportData[c.name].quantity;
      cardStack[c.id] = {
        ...c,
        quantity,
        quantityInSideDeck: 0
      };
    });

    side.forEach(c => {
      const quantity = normalizedSideImportData[c.name].quantity;
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (cardStack[c.id]) {
        cardStack[c.id] = { ...cardStack[c.id], quantityInSideDeck: quantity };
      } else {
        cardStack[c.id] = {
          ...c,
          quantity:           0,
          quantityInSideDeck: quantity
        };
      }
    });


    return {
      cardStack,
      ...this.getDeckStateFromCardStack(cardStack)
    };
  }

  private async convertDataToDeck(deck: Tables<'decks'>): Promise<DeckState & DeckItem> {

    const supabase = this.supabase;

    let cardStack: NormalizedModel<DeckCard> = {};

    const { data: cards, error: errorCards } = await supabase
      .from('deck_card')
      .select('*, cards(*)')
      .eq('deck', deck.id);

    if (errorCards) {
      Logger.error(errorCards, `${DeckRepository.name} ${this.convertDataToDeck.name}`);
      throw new Error('Error fetching deck cards', { cause: errorCards });
    }

    const cardsData: DeckCard[] = cards.map(c => {
      const { cards: card } = c;

      if (!card) {
        const errorCardNotFound = new Error(`Card not found for card id ${c.card}`);
        Logger.error(errorCardNotFound, `${DeckRepository.name} ${this.convertDataToDeck.name}`);
        throw errorCardNotFound;
      }

      return {
        ...card,
        image:              card.image,
        quantity:           c.quantity,
        quantityInSideDeck: c.quantity_side
      };
    });

    cardStack = normalizeArray(cardsData);

    let deckFace: string | undefined = undefined;

    if (deck.deck_face) {
      const { data: face, error: errorDeckFace } = await supabase
        .from('cards')
        .select()
        .eq('id', deck.deck_face);

      if (errorDeckFace) {
        Logger.error(errorDeckFace, `${DeckRepository.name} ${this.convertDataToDeck.name}`);
      } else {
        deckFace = face[0].image;
      }
    }

    return {
      cardStack,
      ...this.getDeckStateFromCardStack(cardStack),
      id:          deck.id,
      name:        deck.name,
      description: deck.description ?? '',
      isPublic:    deck.is_public,
      splashArt:   deckFace,
      // splashArtId: deck.deck_face ?? undefined,
      type1: deck.type_1,
      type2: deck.type_2
    };
  }

  // private async insertDeckCollection(
  //   deckId: number,
  //   collection: CollectionTypes,
  //   deck: { id: number, quantity: number }[]
  // ) {
  //   const collectionId = await this.insertCollection(deckId, collection);
  //
  //   if (collectionId === -1) {
  //     return;
  //   }
  //
  //   const cards: Database['public']['Tables']['card_collection']['Insert'][] = deck.map(card => {
  //     return {
  //       card_id:       card.id,
  //       collection_id: collectionId,
  //       quantity:      card.quantity
  //     };
  //   });
  //
  //   await this.insertCards(cards);
  // }

  private getDeckStateFromCardStack(cardStack: NormalizedModel<DeckCard>) {

    let quantityInMainDeck            = 0;
    let quantityInSideDeck            = 0;
    let quantityInTreasureDeck        = 0;
    let quantityUnitsCards            = 0;
    let quantityActionsCards          = 0;
    let quantityMonumentsWeaponsCards = 0;
    let treasurePoints                = 0;

    Object.values(cardStack).forEach(c => {

      quantityInSideDeck += c.quantityInSideDeck;

      if (c.type === CARD_TYPES.TESORO) {
        quantityInTreasureDeck += c.quantity;

        treasurePoints += parseInt(c.cost);
      } else {
        quantityInMainDeck += c.quantity;

        if (c.type === CARD_TYPES.UNIT) quantityUnitsCards += c.quantity;
        if (c.type === CARD_TYPES.ACTION) quantityActionsCards += c.quantity;
        if (c.type === CARD_TYPES.ARMA || c.type === CARD_TYPES.MONUMENTO) quantityMonumentsWeaponsCards += c.quantity;
      }
    });


    const orderedUnitCards = Object.values(cardStack)
      .filter((c) => c.type === CARD_TYPES.UNIT && c.quantity > 0)
      .toSorted((a, b) => a.name.localeCompare(b.name))
      .map(c => c.id);

    const orderedActionCards = Object.values(cardStack)
      .filter((c) => c.type === CARD_TYPES.ACTION && c.quantity > 0)
      .toSorted((a, b) => a.name.localeCompare(b.name))
      .map(c => c.id);

    const orderedMonumentWeaponCards = Object.values(cardStack)
      .filter((c) => (c.type === CARD_TYPES.MONUMENTO || c.type === CARD_TYPES.ARMA) && c.quantity > 0)
      .toSorted((a, b) => a.name.localeCompare(b.name))
      .map(c => c.id);

    const orderedTreasureCards = Object.values(cardStack)
      .filter(c => c.type === CARD_TYPES.TESORO && c.quantity > 0)
      .toSorted((a, b) => a.name.localeCompare(b.name))
      .map(c => c.id);

    const orderedSideCards = Object.values(cardStack)
      .filter(c => c.quantityInSideDeck > 0)
      .toSorted((a, b) => a.name.localeCompare(b.name))
      .map(c => c.id);

    return {
      quantityMonumentsWeaponsCards,
      quantityUnitsCards,
      treasurePoints,
      quantityInMainDeck,
      quantityInSideDeck,
      quantityActionsCards,
      quantityInTreasureDeck,
      orderedActionCards,
      orderedSideCards,
      orderedUnitCards,
      orderedTreasureCards,
      orderedMonumentWeaponCards
    };

  }

  // private async insertCollection(deckId: number, type: CollectionTypes): Promise<number> {
  //   const supabase = this.supabaseClient;
  //
  //   const { error, data: dekCollectionData } = await supabase.from('collections_decks')
  //     .insert({
  //       deck_id: deckId,
  //       type
  //     })
  //     .select('id');
  //
  //   if (error) {
  //     Logger.error(error, `${DeckRepository.name} ${this.insertCollection.name}`);
  //     return -1;
  //   }
  //
  //   return dekCollectionData[0].id;
  // }
  //
  // private async insertCards(cards: Database['public']['Tables']['card_collection']['Insert'][]) {
  //   const supabase = this.supabaseClient;
  //
  //   const { error } = await supabase
  //     .from('card_collection')
  //     .insert(cards);
  //
  //   if (error) {
  //     Logger.error(error, `${DeckRepository.name} ${this.insertCards.name}`);
  //     return;
  //   }
  // }
}
