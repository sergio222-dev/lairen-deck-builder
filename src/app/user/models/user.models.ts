import type { UserIdValueObject } from '~/app/shared/domain/VO/UserId.ValueObject';

interface UserProps {
  id: UserIdValueObject;
}

export class User {
  private constructor(
    public readonly id: UserIdValueObject,
  ) {
  }

  public static CREATE(props: UserProps) {
    return new User(props.id);
  }
}
