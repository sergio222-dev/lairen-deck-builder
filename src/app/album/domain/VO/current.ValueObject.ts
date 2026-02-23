import { NumberValueObject } from '~/app/shared/domain/VO/number.valueObject';

export class CurrentValueObject extends NumberValueObject {

  decrease() {
    if (this.isZero) return;
    super.decrease();
  }
}
