import type { IdValueObject }   from '~/app/shared/models/VO/Id.ValueObject';
import type { NameValueObject } from '~/app/shared/models/VO/Name.ValueObject';

interface AlbumConstructProps {
  id: IdValueObject;
  name: NameValueObject;
}

export class Album {
  private constructor(public id: IdValueObject, public name: NameValueObject) {
  }

  static CREATE_ALBUM(data: AlbumConstructProps) {
    return new Album(data.id, data.name);
  }
}
