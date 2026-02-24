import type { GetAllCardAlbum } from '~/app/album/application/getAllCardAlbum';
import type { GetDeck } from '~/app/deck/application/getDeck';
import type { User }    from '~/app/shared/application/DTO/user.dto';

import type { CardInfoProection } from '~/app/shared/application/projections/cardInfo.proection';
import { TOKENS }             from '~/app/shared/binds/TOKENS';
import { UserIdValueObject }  from '~/app/shared/domain/VO/userId.valueObject';
import { calculateDeckStats } from '~/app/shared/presenter/utils/calculateDeckStats';
import { UnauthorizedException }   from '~/exceptions/UnauthorizedException';

import type { UIDeckInformation, UIDeckStats, UIUserCollection } from '~/UI/deck/models/deck.store.model';

export class GetDeckPresenter {
  static readonly inject = [TOKENS.GET_DECK, TOKENS.GET_ALL_CARD_ALBUM, TOKENS.CURRENT_USER];

  constructor(private readonly getDeck: GetDeck,
              private readonly getAllCardAlbum: GetAllCardAlbum,
              private readonly getCurrentUser: () => User | null) {
  }

  async execute(deckId: number | null): Promise<UIDeckInformation & UIDeckStats & UIUserCollection> {

    const currentUser = this.getCurrentUser();

    if (!currentUser) {
      throw new UnauthorizedException('');
    }

    const allAlbumCards = await this.getAllCardAlbum.execute(new UserIdValueObject(currentUser.id));

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

    const cardInfoProjection = cards.map<CardInfoProection>(c => {
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
        clarifications: c.clarifications?.value ?? null,
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
      splashArtId:   deck.splashArt?.cardId.value ?? undefined,
      ...stats
    };
  }
}
