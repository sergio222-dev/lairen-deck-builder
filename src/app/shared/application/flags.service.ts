import type { FLAGS } from '~/app/shared/application/constants/flags';

export interface FlagsService {
  getFlag(flag: FLAGS): Promise<boolean>;
}
