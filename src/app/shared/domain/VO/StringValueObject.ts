import type { ValueObject } from '~/app/shared/domain/VO/ValueObject';

export class StringValueObject implements ValueObject<string> {

  static get EMPTY() {
    return new StringValueObject('');
  }

  get value() {
    return this._value;
  }

  constructor(private _value: string) {
  }
}
