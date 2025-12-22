import type { SetFinderRepository } from '~/app/card/infrastructure/setFinder.repository';
import { TOKENS }                   from '~/app/shared/binds/TOKENS';

export class GetAvailableSet {
  public static inject = [TOKENS.SET_FINDER_REPOSITORY];

  constructor(private readonly repo: SetFinderRepository) {
  }

  async execute(): Promise<string[]> {
    return this.repo.getAvailableSet();
  }
}
