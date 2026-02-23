import type { AlbumCardTag }  from '~/app/album/domain/models/albumCardTag.model';
import type { IdValueObject } from '~/app/shared/domain/VO/id.valueObject';
import { NumberValueObject }  from '~/app/shared/domain/VO/number.valueObject';

export class AlbumCard {
  private _cardTags: AlbumCardTag[] = [];

  get cardId(): IdValueObject {
    return this._cardId;
  }

  get tags(): AlbumCardTag[] {
    return this._cardTags;
  }

  // get tagId(): IdValueObject {
  //   return this._tagId;
  // }
  //
  // get quantity(): NumberValueObject {
  //   return this._quantity;
  // }

  public constructor(
    private readonly _cardId: IdValueObject
  ) {
  }

  public getTotalQuantity(): NumberValueObject {
    return this.tags.reduce((total, tag) => {
      total.add(tag.quantity);
      return total;
    }, new NumberValueObject(0));
  }

  public getQuantity(tagId: IdValueObject) {
    const tag = this.tags.find(t => t.id.equals(tagId));

    if (!tag) {
      throw new Error(`Tag with id ${tagId.value} not found`);
    }

    return tag.quantity;
  }

  public addTag(tag: AlbumCardTag) {
    this._cardTags.push(tag);
  }

  public addCardTag(tagId: IdValueObject, quantity: NumberValueObject) {
    const tag = this.tags.find(t => t.id.equals(tagId));

    if (!tag) {
      throw new Error(`Cannot add card tag: ${tagId.value} because the tag is not in the card`);
    }

    tag.add(quantity);
  }
}
