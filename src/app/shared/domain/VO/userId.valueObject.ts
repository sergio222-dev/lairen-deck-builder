import type { ValueObject } from '~/app/shared/domain/VO/valueObject';

export class UserIdValueObject implements ValueObject<string> {
  constructor(public readonly value: string) {}
}
