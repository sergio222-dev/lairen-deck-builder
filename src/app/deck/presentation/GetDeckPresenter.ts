import type { GetAllCardAlbum } from '~/app/album/application/getAllCardAlbum';
import type { GetDeck }         from '~/app/deck/application/getDeck';

import type { CardInfoProjection } from '~/app/shared/application/projections/CardInfoProjection';
import { TOKENS }                  from '~/app/shared/binds/TOKENS';
import { calculateDeckStats }      from '~/app/shared/presenter/utils/calculateDeckStats';

import type { UIDeckInformation, UIDeckStats, UIUserCollection } from '~/UI/deck/models/deck.store.model';

export class GetDeckPresenter {
  static readonly inject = [TOKENS.GET_DECK, TOKENS.GET_ALL_CARD_ALBUM];

  constructor(private readonly getDeck: GetDeck, private readonly getAllCardAlbum: GetAllCardAlbum) {
  }

  async execute(deckId: number | null): Promise<UIDeckInformation & UIDeckStats & UIUserCollection> {

    const allAlbumCards = await this.getAllCardAlbum.execute();

    const collection = allAlbumCards.reduce<Record<string, number>>((a, v) => {
      a[v.id] = v.quantity;

      return a;
    }, {});

    if (!deckId) {

      const stats = calculateDeckStats([], [], collection);

      return {
        deckId:      0,
        name:        '',
        description: null,
        isPublic:    false,
        type1:       null,
        type2:       null,
        splashArt:   undefined,
        ...stats
      };
    }

    const [deck, cards] = await this.getDeck.execute(deckId);

    const cardInfoProjection = cards.map<CardInfoProjection>(c => {
      return {
        id:             c.id.value,
        image:          c.image.value,
        cost:           c.cost.value,
        name:           c.name.value,
        set:            c.set.value,
        rarity:         c.rarity.value,
        subtype1:       c.subtype1.value,
        subtype2:       c.subtype2.value,
        text:           c.text.value,
        type:           c.type.value,
        thumbnail:      c.thumbnail.value,
        supertype:      c.supertype.value,
        clarifications: c.clarifications?.value ?? null
      };
    });

    const cardsDeck = deck.cards.map(c => {
      return {
        id:             c.cardId.value,
        quantity:       c.quantity.value,
        quantityInSide: c.quantitySide.value
      };
    });


    const stats = calculateDeckStats(cardInfoProjection, cardsDeck, collection);

    return {
      deckId:      deck.id.value,
      name:        deck.name.value,
      description: deck.description?.value ?? null,
      isPublic:    deck.isPublic,
      type1:       deck.type1?.value ?? null,
      type2:       deck.type2?.value ?? null,
      splashArt:   deck.splashArt?.image.value ?? undefined,
      ...stats
    };
  }
}
