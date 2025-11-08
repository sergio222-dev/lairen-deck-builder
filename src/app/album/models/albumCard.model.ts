import type { AlbumCardTag }      from '~/app/album/models/albumCardTag.model';
import type { IdValueObject }     from '~/app/shared/models/VO/Id.ValueObject';
import type { NameValueObject }   from '~/app/shared/models/VO/Name.ValueObject';
import type { StringValueObject } from '~/app/shared/models/VO/StringValueObject';

export class AlbumCard {
  private _cardTags: AlbumCardTag[] = [];

  get id(): IdValueObject {
    return this._id;
  }

  get name(): NameValueObject {
    return this._name;
  }

  get image(): StringValueObject {
    return this._image;
  }

  get tags(): AlbumCardTag[] {
    return this._cardTags;
  }

  public constructor(
    private readonly _id: IdValueObject,
    private readonly _name: NameValueObject,
    private readonly _image: StringValueObject
  ) {
  }

  public addTag(tag: AlbumCardTag) {
    this._cardTags.push(tag);
  }
}
