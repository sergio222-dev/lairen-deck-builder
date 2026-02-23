import type { IdValueObject }     from '~/app/shared/domain/VO/id.valueObject';
import type { StringValueObject } from '~/app/shared/domain/VO/string.valueObject';

export class SplashArt {
  constructor(
    private readonly _cardId: IdValueObject,
    private readonly _image: StringValueObject
  ) {
  }

  get cardId(): IdValueObject {
    return this._cardId;
  }

  get image(): StringValueObject {
    return this._image;
  }
}
