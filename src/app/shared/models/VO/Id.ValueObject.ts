import type { ValueObject } from '~/app/shared/models/VO/ValueObject';

export class IdValueObject implements ValueObject<number>{
  get value() {
    return this._id;
  }

  constructor(private _id: number) {}

  equals(id: IdValueObject) {
    return this._id === id._id;
  }
}
