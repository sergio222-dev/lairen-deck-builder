import { NumberValueObject } from '~/app/shared/domain/VO/NumberValueObject';

export class CurrentValueObject extends NumberValueObject {

  decrease() {
    if (this.isZero) return;
    super.decrease();
  }
}
