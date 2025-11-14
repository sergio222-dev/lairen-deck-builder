import type { AlbumCardTag }  from '~/app/album/domain/models/albumCardTag.model';
import type { IdValueObject } from '~/app/shared/domain/VO/Id.ValueObject';
import { NumberValueObject }  from '~/app/shared/domain/VO/NumberValueObject';

export class AlbumCard {
  private _cardTags: AlbumCardTag[] = [];

  get id(): IdValueObject {
    return this._id;
  }

  get tags(): AlbumCardTag[] {
    return this._cardTags;
  }

  public constructor(
    private readonly _id: IdValueObject
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

  public addCardTag(tagId: IdValueObject, amount: NumberValueObject) {
    const tag = this.tags.find(t => t.id.equals(tagId));

    if (!tag) {
      throw new Error(`Cannot add card tag: ${tagId.value} because the tag is not in the card`);
    }

    tag.add(amount);
  }
}
