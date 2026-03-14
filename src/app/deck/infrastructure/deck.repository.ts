import type { SupabaseClient }    from '@supabase/supabase-js';
import { Deck }                   from '~/app/deck/domain/models/deck.model';
import { TOKENS }                 from '~/app/shared/binds/TOKENS';
import { IdValueObject }          from '~/app/shared/domain/VO/id.valueObject';
import type { UserIdValueObject } from '~/app/shared/domain/VO/userId.valueObject';
import { POSTGREST_ERROR_CODE }   from '~/app/shared/infrastructure/postgress/errorCode';
import { Logger }                 from '~/lib/logger';
import type { Database }          from '../../../../database.extension.types';

export class DeckRepository {
  public static inject = [TOKENS.SUPABASE];

  constructor(private readonly supabase: SupabaseClient<Database, 'public'>) {
  }

  public async listPublicDeck(): Promise<Deck[]> {
    const { data, error } = await this.supabase.from('decks').select(`
    *, deck_face ( image, id )
    `)
      .order('created_at', {
        ascending: false,
      })
      .eq('is_public', true);

    if (error) {
      Logger.error(error, `Error fetching public decks`);
      throw error;
    }

    return data.map(d => {
      return Deck.HYDRATE({
        ...d,
        deck_card: []
      });
    });
  }

  public async listUserDecks(owner: UserIdValueObject): Promise<Deck[]> {
    const { data, error } = await this.supabase
      .from('decks')
      .select(`
      *,
      deck_face ( image, id )
      `)
      .order('updated_at', {
        ascending: false,
      })
      .eq('owner', owner.value);

    if (error) {
      Logger.error(error, `${DeckRepository.name} ${this.listUserDecks.name}`);
      throw error;
    }

    return data.map(deck => {
      return Deck.HYDRATE({
        ...deck,
        deck_card: []
      });
    });
  }

  public async saveDeck(deck: Deck): Promise<IdValueObject> {
    const { error, data } = await this.supabase.rpc('deck_save', {
      deck_data: {
        id:          deck.id.value,
        name:        deck.name.value,
        description: deck.description?.value ?? '',
        is_public:   deck.isPublic,
        deck_face:   deck.splashArt?.cardId.value,
        type_1:      deck.type1?.value,
        type_2:      deck.type2?.value,
        cards:       deck.cards.map(c => ({
          id:            c.cardId.value,
          quantity:      c.quantity.value,
          quantity_side: c.quantitySide.value
        }))
      }
    });

    if (error) {
      Logger.error(error);
      throw error;
    }

    return new IdValueObject(data);
  }

  public async deleteDeck(deckId: IdValueObject): Promise<void> {
    const { error } = await this.supabase.from('decks').delete().eq('id', deckId.value);

    if (error) {
      Logger.error(error, `${DeckRepository.name} ${this.deleteDeck.name}`);
      return;
    }
  }

  public async getDeckById(deckId: IdValueObject): Promise<Deck | null> {
    const { data, error } = await this.supabase
      .from('decks')
      .select(`
        id,
        name,
        owner,
        description,
        is_public,
        type_1,
        type_2,
        deck_face(
          image,
          id
        ),
        deck_card(
          card( id ),
          quantity,
          quantity_side
        )
      `)
      .eq('id', deckId.value)
      .single();


    if (error) {
      Logger.error(error);

      if (error.code === POSTGREST_ERROR_CODE.FOUND_ITEMS_DIFFERENT_OF_ONE) {
        return null;
      }

      throw error;
    }

    return Deck.HYDRATE(data);
  }

  // public async getPublicDeck(deckId: number): Promise<DeckData> {
  //   const { data, error } = await this.supabase
  //     .from('decks')
  //     .select(`*, cards ( image )`)
  //     .eq('id', deckId)
  //     .eq('is_public', true);
  //
  //   if (error) {
  //     Logger.error(error, `${DeckRepository.name} ${this.getPublicDeck.name}`);
  //     throw new Error('Deck not found', { cause: error });
  //   }
  //
  //   const [deck, errorConversion] = await on(this.convertDataToDeck(data[0]));
  //
  //   if (errorConversion) {
  //     Logger.error(errorConversion, `${DeckRepository.name} ${this.getPublicDeck.name}`);
  //     throw new Error('Error converting deck', { cause: errorConversion });
  //   }
  //
  //   return {
  //     ...deck
  //   };
  // }
  //

  // public async getDeckByImport(importData: ImportDeckRequest): Promise<DeckState> {
  //   const supabase = this.supabase;
  //
  //   // fetch realm
  //   const { data: realm, error } = await supabase
  //     .from('cards')
  //     .select()
  //     .in('name', importData.realm.map(c => c.name));
  //
  //   if (error) {
  //     Logger.error(error, `${DeckRepository.name} ${this.getDeckByImport.name}`);
  //     throw new Error('Deck not found', { cause: error });
  //   }
  //
  //   // fetch treasure
  //   const { data: treasure, error: errorTreasure } = await supabase
  //     .from('cards')
  //     .select()
  //     .in('name', importData.treasure.map(c => c.name));
  //
  //   if (errorTreasure) {
  //     Logger.error(errorTreasure, `${DeckRepository.name} ${this.getDeckByImport.name}`);
  //     throw new Error('Deck not found', { cause: errorTreasure });
  //   }
  //
  //   // fetch side
  //   const { data: side, error: errorSide } = await supabase
  //     .from('cards')
  //     .select()
  //     .in('name', importData.side.map(c => c.name));
  //
  //   if (errorSide) {
  //     Logger.error(errorSide, `${DeckRepository.name} ${this.getDeckByImport.name}`);
  //     throw new Error('Deck not found', { cause: errorSide });
  //   }
  //
  //   // create card stack
  //   const cardStack: NormalizedModel<DeckCard> = {};
  //
  //   const normalizedRealmImportData = importData.realm
  //     .reduce<Record<string, { name: string, quantity: number }>>((a,
  //                                                                  c) => {
  //       a[c.name] = { ...c };
  //       return a;
  //     }, {});
  //
  //   const normalizedTreasureImportData = importData.treasure.reduce<Record<string, { name: string, quantity: number }>>(
  //     (a, c) => {
  //       a[c.name] = { ...c };
  //       return a;
  //     },
  //     {});
  //
  //   const normalizedSideImportData = importData.side.reduce<Record<string, { name: string, quantity: number }>>((a,
  //                                                                                                                c) => {
  //     a[c.name] = { ...c };
  //     return a;
  //   }, {});
  //
  //   realm.forEach(c => {
  //     const quantity  = normalizedRealmImportData[c.name].quantity;
  //     cardStack[c.id] = {
  //       ...c,
  //       quantity,
  //       quantityInSideDeck: 0
  //     };
  //   });
  //
  //   treasure.forEach(c => {
  //     const quantity  = normalizedTreasureImportData[c.name].quantity;
  //     cardStack[c.id] = {
  //       ...c,
  //       quantity,
  //       quantityInSideDeck: 0
  //     };
  //   });
  //
  //   side.forEach(c => {
  //     const quantity = normalizedSideImportData[c.name].quantity;
  //     // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  //     if (cardStack[c.id]) {
  //       cardStack[c.id] = { ...cardStack[c.id], quantityInSideDeck: quantity };
  //     } else {
  //       cardStack[c.id] = {
  //         ...c,
  //         quantity:           0,
  //         quantityInSideDeck: quantity
  //       };
  //     }
  //   });
  //
  //
  //   return {
  //     cardStack,
  //     ...this.getDeckStateFromCardStack(cardStack)
  //   };
  // }

  // private async convertDataToDeck(deck: Tables<'decks'>): Promise<DeckState & DeckItem> {
  //
  //   const supabase = this.supabase;
  //
  //   let cardStack: NormalizedModel<DeckCard> = {};
  //
  //   const { data: cards, error: errorCards } = await supabase
  //     .from('deck_card')
  //     .select('*, cards(*)')
  //     .eq('deck', deck.id);
  //
  //   if (errorCards) {
  //     Logger.error(errorCards, `${DeckRepository.name} ${this.convertDataToDeck.name}`);
  //     throw new Error('Error fetching deck cards', { cause: errorCards });
  //   }
  //
  //   const cardsData: DeckCard[] = cards.map(c => {
  //     const { cards: card } = c;
  //
  //     if (!card) {
  //       const errorCardNotFound = new Error(`Card not found for card id ${c.card}`);
  //       Logger.error(errorCardNotFound, `${DeckRepository.name} ${this.convertDataToDeck.name}`);
  //       throw errorCardNotFound;
  //     }
  //
  //     return {
  //       ...card,
  //       image:              card.image,
  //       quantity:           c.quantity,
  //       quantityInSideDeck: c.quantity_side
  //     };
  //   });
  //
  //   cardStack = normalizeArray(cardsData);
  //
  //   let deckFace: string | undefined = undefined;
  //
  //   if (deck.deck_face) {
  //     const { data: face, error: errorDeckFace } = await supabase
  //       .from('cards')
  //       .select()
  //       .eq('id', deck.deck_face);
  //
  //     if (errorDeckFace) {
  //       Logger.error(errorDeckFace, `${DeckRepository.name} ${this.convertDataToDeck.name}`);
  //     } else {
  //       deckFace = face[0].image;
  //     }
  //   }
  //
  //   return {
  //     cardStack,
  //     ...this.getDeckStateFromCardStack(cardStack),
  //     id:          deck.id,
  //     name:        deck.name,
  //     description: deck.description ?? '',
  //     isPublic:    deck.is_public,
  //     splashArt:   deckFace,
  //     // splashArtId: deck.deck_face ?? undefined,
  //     type1: deck.type_1,
  //     type2: deck.type_2
  //   };
  // }

  // private getDeckStateFromCardStack(cardStack: NormalizedModel<DeckCard>) {
  //
  //   let quantityInMainDeck            = 0;
  //   let quantityInSideDeck            = 0;
  //   let quantityInTreasureDeck        = 0;
  //   let quantityUnitsCards            = 0;
  //   let quantityActionsCards          = 0;
  //   let quantityMonumentsWeaponsCards = 0;
  //   let treasurePoints                = 0;
  //
  //   Object.values(cardStack).forEach(c => {
  //
  //     quantityInSideDeck += c.quantityInSideDeck;
  //
  //     if (c.type === CARD_TYPES.TESORO) {
  //       quantityInTreasureDeck += c.quantity;
  //
  //       treasurePoints += parseInt(c.cost);
  //     } else {
  //       quantityInMainDeck += c.quantity;
  //
  //       if (c.type === CARD_TYPES.UNIT) quantityUnitsCards += c.quantity;
  //       if (c.type === CARD_TYPES.ACTION) quantityActionsCards += c.quantity;
  //       if (c.type === CARD_TYPES.ARMA || c.type === CARD_TYPES.MONUMENTO) quantityMonumentsWeaponsCards += c.quantity;
  //     }
  //   });
  //
  //
  //   const orderedUnitCards = Object.values(cardStack)
  //     .filter((c) => c.type === CARD_TYPES.UNIT && c.quantity > 0)
  //     .toSorted((a, b) => a.name.localeCompare(b.name))
  //     .map(c => c.id);
  //
  //   const orderedActionCards = Object.values(cardStack)
  //     .filter((c) => c.type === CARD_TYPES.ACTION && c.quantity > 0)
  //     .toSorted((a, b) => a.name.localeCompare(b.name))
  //     .map(c => c.id);
  //
  //   const orderedMonumentWeaponCards = Object.values(cardStack)
  //     .filter((c) => (c.type === CARD_TYPES.MONUMENTO || c.type === CARD_TYPES.ARMA) && c.quantity > 0)
  //     .toSorted((a, b) => a.name.localeCompare(b.name))
  //     .map(c => c.id);
  //
  //   const orderedTreasureCards = Object.values(cardStack)
  //     .filter(c => c.type === CARD_TYPES.TESORO && c.quantity > 0)
  //     .toSorted((a, b) => a.name.localeCompare(b.name))
  //     .map(c => c.id);
  //
  //   const orderedSideCards = Object.values(cardStack)
  //     .filter(c => c.quantityInSideDeck > 0)
  //     .toSorted((a, b) => a.name.localeCompare(b.name))
  //     .map(c => c.id);
  //
  //   return {
  //     quantityMonumentsWeaponsCards,
  //     quantityUnitsCards,
  //     treasurePoints,
  //     quantityInMainDeck,
  //     quantityInSideDeck,
  //     quantityActionsCards,
  //     quantityInTreasureDeck,
  //     orderedActionCards,
  //     orderedSideCards,
  //     orderedUnitCards,
  //     orderedTreasureCards,
  //     orderedMonumentWeaponCards
  //   };
  //
  // }
}
