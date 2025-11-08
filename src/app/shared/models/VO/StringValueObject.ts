import type { ValueObject } from '~/app/shared/models/VO/ValueObject';

export class StringValueObject implements ValueObject<string> {
  get value() {
    return this._value;
  }

  constructor(private _value: string) {
  }
}
