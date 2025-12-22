import type { IdValueObject }     from '~/app/shared/domain/VO/Id.ValueObject';
import type { StringValueObject } from '~/app/shared/domain/VO/StringValueObject';

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
