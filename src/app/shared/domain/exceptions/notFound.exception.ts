import { DomainException }        from '~/app/shared/domain/exceptions/domain.exception';
import type { IdValueObject }     from '~/app/shared/domain/VO/id.valueObject';
import type { UserIdValueObject } from '~/app/shared/domain/VO/userId.valueObject';

export class NotFoundException extends DomainException {
  constructor(private userId: UserIdValueObject, private entityId: IdValueObject) {
    super(`Entity with id ${entityId.value} not found for user with id ${userId.value}`);
  }

  toString(): string {
    return JSON.stringify({
      entityId: this.entityId.value,
      userId:   this.userId.value,
      message:  this.message
    });
  }
}
