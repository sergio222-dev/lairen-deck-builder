import type { IdValueObject }   from '~/app/shared/models/VO/Id.ValueObject';
import type { NameValueObject } from '~/app/shared/models/VO/Name.ValueObject';

interface AlbumTagProps {
  id: IdValueObject;
  name: NameValueObject;
}

export class AlbumTag {

  private constructor(
    public readonly id: IdValueObject,
    public readonly name: NameValueObject
  ) {
  }

  static CREATE(data: AlbumTagProps) {
    const { id, name } = data;

    return new AlbumTag(id, name);
  }
}
