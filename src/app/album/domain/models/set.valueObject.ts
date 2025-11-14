import type { ValueObject } from '~/app/shared/domain/VO/ValueObject';

export class SetValueObject implements ValueObject<string[]> {
  get value() {
    return this._sets;
  }

  constructor(private _sets: string[]) {}
}
