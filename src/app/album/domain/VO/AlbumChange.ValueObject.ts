import type { ComplexValueObject } from '~/app/shared/domain/VO/ComplexValueObject';
import { IdValueObject }           from '~/app/shared/domain/VO/Id.ValueObject';
import { NumberValueObject }       from '~/app/shared/domain/VO/NumberValueObject';

interface AlbumChangeModel {
  tagId: IdValueObject;
  amount: NumberValueObject;
  cardId: IdValueObject;
}

export class AlbumChangeValueObject implements ComplexValueObject<AlbumChangeModel> {
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
