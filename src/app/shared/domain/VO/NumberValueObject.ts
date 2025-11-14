import type { ValueObject } from '~/app/shared/domain/VO/ValueObject';

export class NumberValueObject implements ValueObject<number> {
  static ZERO = new NumberValueObject(0);

  constructor(private _value: number) {
  }

  get value() {
    return this._value;
  }

  add(value: NumberValueObject) {
    this._value += value.value;
  }

  sub(value: NumberValueObject) {
    this._value -= value.value;
  }

  increase() {
    this._value++;
  }

  decrease() {
    this._value--;
  }

  get isZero(): boolean {
    return this._value === 0;
  }
}
