import type { IdValueObject }     from '~/app/shared/domain/VO/Id.ValueObject';
import type { NumberValueObject } from '~/app/shared/domain/VO/NumberValueObject';

export class DeckCard {
  constructor(
    private _cardId: IdValueObject,
    private _quantity: NumberValueObject,
    private _quantitySide: NumberValueObject
  ) {
  }

  get cardId(): IdValueObject {
    return this._cardId;
  }

  get quantity(): NumberValueObject {
    return this._quantity;
  }

  get quantitySide(): NumberValueObject {
    return this._quantitySide;
  }
}
