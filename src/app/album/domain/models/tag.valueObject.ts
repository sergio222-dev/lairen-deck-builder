import type { ValueObject } from '~/app/shared/domain/VO/ValueObject';

export class TagValueObject implements ValueObject<[number, string]> {
  get value() {
    return this._tags;
  }

  constructor(private _tags: string[]) {
  }
}
