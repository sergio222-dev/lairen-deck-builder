import type { ValueObject } from '~/app/shared/domain/VO/valueObject';

export class SetValueObject implements ValueObject<string[]> {
  get value() {
    return this._sets;
  }

  constructor(private _sets: string[]) {}
}
