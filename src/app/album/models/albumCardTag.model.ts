import type { AlbumCardTagRaw } from '~/app/album/models/DTO/AlbumRaw.dto';
import { IdValueObject }        from '~/app/shared/models/VO/Id.ValueObject';
import { NameValueObject }      from '~/app/shared/models/VO/Name.ValueObject';
import { NumberValueObject }    from '~/app/shared/models/VO/NumberValueObject';

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

  add() {
    this._quantity.add(1);
  }

  remove() {
    this._quantity.remove(1);
  }
}
