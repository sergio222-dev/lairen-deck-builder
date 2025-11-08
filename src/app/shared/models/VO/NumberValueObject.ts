import type { ValueObject } from '~/app/shared/models/VO/ValueObject';

export class NumberValueObject implements ValueObject<number> {
  constructor(private _value: number) {
  }

  get value() {
    return this._value;
  }

  add(value: number) {
    this._value += value;
  }

  remove(value: number) {
    this._value -= value;
  }
}
