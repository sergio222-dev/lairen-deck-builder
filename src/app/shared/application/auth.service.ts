import type { User } from '~/app/shared/application/DTO/user.dto';

export interface AuthService {
  getUser(accessToken?: string): Promise<User | null>;
}
