import type { ComplexValueValueObject } from '~/app/shared/domain/VO/complexValue.valueObject';
import { IdValueObject }                from '~/app/shared/domain/VO/id.valueObject';
import { NumberValueObject }            from '~/app/shared/domain/VO/number.valueObject';

interface AlbumChangeModel {
  tagId: IdValueObject;
  amount: NumberValueObject;
  cardId: IdValueObject;
}

export class AlbumChangeValueObject implements ComplexValueValueObject<AlbumChangeModel> {
  private readonly _change: AlbumChangeModel;

  get props() {
    return this._change;
  }

  constructor(cardId: number, tagId: number, amount: number) {
    this._change = {
      tagId:  new IdValueObject(tagId),
      amount: new NumberValueObject(amount),
      cardId: new IdValueObject(cardId)
    };
  }

}
