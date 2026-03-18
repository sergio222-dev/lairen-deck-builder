import type { DeckRawDto }  from '~/app/deck/domain/DTO/deckRaw.dto';
import { DeckCreatedEvent } from '~/app/deck/domain/events/deckCreated.event';
import { DeckCard }         from '~/app/deck/domain/models/deckCard.model';
import { SplashArt }        from '~/app/deck/domain/models/splashArt.model';

import { AggregateRoot }   from '~/app/shared/domain/models/aggregateRoot';
import { IdValueObject }   from '~/app/shared/domain/VO/id.valueObject';
import { NameValueObject } from '~/app/shared/domain/VO/name.ValueObject';
import { NumberValueObject } from '~/app/shared/domain/VO/number.valueObject';
import { StringValueObject } from '~/app/shared/domain/VO/string.valueObject';
import { UserIdValueObject } from '~/app/shared/domain/VO/userId.valueObject';

export interface DeckInfo {
  id: number;
  name: string;
  description: string | null;
  splashArtId: number | null;
  isPublic: boolean;
  type1: string | null;
  type2: string | null;
}

export interface DeckInfoWithImage extends Omit<DeckInfo, 'splashArtId'> {
  splashArt: string | undefined;
}

export interface DeckCardInfo {
  id: number;
  quantity: number;
  quantityInSideDeck: number;
}

export interface PublicDeckInfo extends Omit<DeckInfoWithImage, 'type1' | 'type2'> {
}

export interface DeckModel extends DeckInfo {
  cards: DeckCardInfo[] | null;
}

interface DeckConstructProps {
  name: NameValueObject,
  isPublic: boolean;
  owner?: UserIdValueObject,
  description?: StringValueObject,
  type1?: StringValueObject,
  type2?: StringValueObject,
  splashArt?: SplashArt;
}

export class Deck extends AggregateRoot {

  private _splashArt?: SplashArt;

  private _cards: DeckCard[] = [];

  private constructor(
    private readonly _id: IdValueObject,
    private _name: NameValueObject,
    private _isPublic: boolean,
    private readonly _owner?: UserIdValueObject,
    private _description?: StringValueObject,
    private _type1?: StringValueObject,
    private _type2?: StringValueObject
  ) {
    super();
  }

  static CREATE(props: DeckConstructProps) {
    const { name, description, isPublic, type2, type1, owner } = props;

    const deck = new Deck(new IdValueObject(0), name, isPublic, owner, description, type1, type2);

    deck._events.push(new DeckCreatedEvent(deck._id.value));

    return deck;
  }

  static HYDRATE(data: DeckRawDto) {
    const deck = new Deck(
      new IdValueObject(data.id),
      new NameValueObject(data.name),
      data.is_public,

      // optional: owner
      data.owner
        ? new UserIdValueObject(data.owner)
        : undefined,

      // optional: description
      data.description
        ? new StringValueObject(data.description)
        : undefined,

      // optional: type1
      data.type_1
        ? new StringValueObject(data.type_1)
        : undefined,

      // optional: type2
      data.type_2
        ? new StringValueObject(data.type_2)
        : undefined
    );

    if (data.deck_face) {
      deck._splashArt =
        new SplashArt(new IdValueObject(data.deck_face.id), new StringValueObject(data.deck_face.image));
    }

    deck._cards = data.deck_card.map(c => {

      return new DeckCard(
        new IdValueObject(c.card.id),
        new NumberValueObject(c.quantity),
        new NumberValueObject(c.quantity_side)
      );
    });

    return deck;
  }

  get splashArt(): SplashArt | undefined {
    return this._splashArt;
  }

  get cards(): DeckCard[] {
    return this._cards;
  }

  get id(): IdValueObject {
    return this._id;
  }

  get owner(): UserIdValueObject | undefined {
    return this._owner;
  }

  get name(): NameValueObject {
    return this._name;
  }

  get isPublic(): boolean {
    return this._isPublic;
  }

  get description(): StringValueObject | undefined {
    return this._description;
  }

  get type1(): StringValueObject | undefined {
    return this._type1;
  }

  get type2(): StringValueObject | undefined {
    return this._type2;
  }

  replaceCards(cards: DeckCard[]) {
    this._cards = cards;
  }

  assignSplashArt(splashArt: SplashArt) {
    this._splashArt = splashArt;
  }

  rename(name: NameValueObject) {
    this._name = name;
  }

  changeDescription(description: StringValueObject) {
    this._description = description;
  }

  changeVisibility(isPublic: boolean) {
    this._isPublic = isPublic;
  }

  changeType1(type: StringValueObject) {
    this._type1 = type;
  }

  changeType2(type: StringValueObject) {
    this._type2 = type;
  }

}
