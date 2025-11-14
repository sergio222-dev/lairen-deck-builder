import type { ValueObject } from '~/app/shared/domain/VO/ValueObject';

export class StringValueObject implements ValueObject<string> {
  get value() {
    return this._value;
  }

  constructor(private _value: string) {
  }
}
