import type { IdValueObject }     from '~/app/shared/domain/VO/Id.ValueObject';
import type { NameValueObject }   from '~/app/shared/domain/VO/Name.ValueObject';
import type { NumberValueObject } from '~/app/shared/domain/VO/NumberValueObject';

export class AlbumCardTag {
  get id(): IdValueObject {
    return this._id;
  }

  get name(): NameValueObject {
    return this._name;
  }

  get quantity(): NumberValueObject {
    return this._quantity;
  }

  constructor(
    private readonly _id: IdValueObject,
    private readonly _name: NameValueObject,
    private _quantity: NumberValueObject
  ) {
  }

  add(amount: NumberValueObject) {
    this._quantity.add(amount);
  }
}
