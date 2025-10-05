import type { ValueObject } from '~/app/shared/models/VO/ValueObject';

export class NameValueObject implements ValueObject<string> {
  get value(): string {
    return this._name;
  }

  constructor(private _name: string) {
  }
}
