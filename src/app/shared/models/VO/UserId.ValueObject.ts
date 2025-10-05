import type { ValueObject } from '~/app/shared/models/VO/ValueObject';

export class UserIdValueObject implements ValueObject<string> {
  constructor(public readonly value: string) {}
}
