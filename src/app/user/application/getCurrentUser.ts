import { TOKENS }              from '~/app/shared/binds/TOKENS';
import type { UserRepository } from '~/app/user/infrastructure/user.repository';

export class GetCurrentUser {
  public static inject = [TOKENS.USER_REPOSITORY] as const;

  constructor(private readonly userRepository: UserRepository) {
  }

  async execute() {
    return await this.userRepository.getCurrentUser();
  }
}
