import type { ValueObject } from '~/app/shared/domain/VO/valueObject';

export class NameValueObject implements ValueObject<string> {
  get value(): string {
    return this._name;
  }

  constructor(private _name: string) {
  }
}
