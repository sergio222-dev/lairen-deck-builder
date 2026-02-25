import type { User } from '~/app/shared/application/DTO/user.dto';

export interface AuthService {
  authenticate(accessToken?: string): Promise<User>;
}
