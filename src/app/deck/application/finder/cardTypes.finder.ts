import { FindAllUnitTypesProjection } from '~/app/deck/application/projection/findAllUnitTypes.projection';

export interface CardTypesFinder {
  findAllUnitTypes(): Promise<FindAllUnitTypesProjection>
}
