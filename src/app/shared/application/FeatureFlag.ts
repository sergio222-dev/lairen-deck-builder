import type { FEATURES } from '~/app/shared/application/enums/FEATURES';

export interface FeatureFlag {
  isEnabled(feature: FEATURES): Promise<boolean>;
}
