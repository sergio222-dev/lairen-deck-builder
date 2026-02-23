import { DomainException }        from '~/app/shared/domain/exceptions/domain.exception';
import type { IdValueObject }     from '~/app/shared/domain/VO/id.valueObject';
import type { UserIdValueObject } from '~/app/shared/domain/VO/userId.valueObject';

export class OwnershipException extends DomainException {
  constructor(private userId: UserIdValueObject, private entityId: IdValueObject) {
    super(`The user with id ${userId.value} does not own the entity with id ${entityId.value}`);
  }

  toString(): string {
    return JSON.stringify({
      entityId: this.entityId.value,
      userId:   this.userId.value,
      message:  this.message
    });
  }
}
