import type { CardRawDto }   from '~/app/card/models/DTO/CardRaw.dto';
import { AggregateRoot }     from '~/app/shared/domain/models/AggregateRoot';
import { IdValueObject }     from '~/app/shared/domain/VO/Id.ValueObject';
import { NameValueObject }   from '~/app/shared/domain/VO/Name.ValueObject';
import { NumberValueObject } from '~/app/shared/domain/VO/NumberValueObject';
import { StringValueObject } from '~/app/shared/domain/VO/StringValueObject';

export interface CardInfo {
  id: number;
  name: string;
  rarity: string;
  type: string;
  supertype: string;
  subtype1: string;
  subtype2: string;
  cost: number;
  text: string;
  image: string;
  thumbnail: string;
  set: string;
  clarifications: string | null;
}

export class Card extends AggregateRoot {
  get id(): IdValueObject {
    return this._id;
  }

  get name(): NameValueObject {
    return this._name;
  }

  get rarity(): StringValueObject {
    return this._rarity;
  }

  get type(): StringValueObject {
    return this._type;
  }

  get supertype(): StringValueObject {
    return this._supertype;
  }

  get subtype1(): StringValueObject {
    return this._subtype1;
  }

  get subtype2(): StringValueObject {
    return this._subtype2;
  }

  get cost(): NumberValueObject {
    return this._cost;
  }

  get text(): StringValueObject {
    return this._text;
  }

  get image(): StringValueObject {
    return this._image;
  }

  get thumbnail(): StringValueObject {
    return this._thumbnail;
  }

  get set(): StringValueObject {
    return this._set;
  }

  get clarifications(): StringValueObject | null {
    return this._clarifications;
  }

  private constructor(
    private readonly _id: IdValueObject,
    private readonly _name: NameValueObject,
    private readonly _rarity: StringValueObject,
    private readonly _type: StringValueObject,
    private readonly _supertype: StringValueObject,
    private readonly _subtype1: StringValueObject,
    private readonly _subtype2: StringValueObject,
    private readonly _cost: NumberValueObject,
    private readonly _text: StringValueObject,
    private readonly _image: StringValueObject,
    private readonly _thumbnail: StringValueObject,
    private readonly _set: StringValueObject,
    private readonly _clarifications: StringValueObject | null = null
  ) {
    super();
  }

  static HYDRATE(data: CardRawDto) {
    return new Card(
      new IdValueObject(data.id),
      new NameValueObject(data.name),
      new StringValueObject(data.rarity),
      new StringValueObject(data.type),
      new StringValueObject(data.supertype),
      new StringValueObject(data.subtype),
      new StringValueObject(data.subtype2),
      new NumberValueObject(parseInt(data.cost, 10)),
      new StringValueObject(data.text),
      new StringValueObject(data.image),
      new StringValueObject(data.thumbnail),
      new StringValueObject(data.set),
      data.clarifications ? new StringValueObject(data.clarifications) : null
    );
  }
}
