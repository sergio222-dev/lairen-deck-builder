import type { CreateAlbum } from '~/app/album/application/createAlbum';
import { Album }            from '~/app/album/models/album.model';
import { SetValueObject }   from '~/app/album/models/set.valueObject';

import { TOKENS }            from '~/app/shared/binds/TOKENS';
import { IdValueObject }     from '~/app/shared/models/VO/Id.ValueObject';
import { NameValueObject }   from '~/app/shared/models/VO/Name.ValueObject';
import { NumberValueObject } from '~/app/shared/models/VO/NumberValueObject';
import { UserIdValueObject } from '~/app/shared/models/VO/UserId.ValueObject';

interface CreateAlbumPresenterOptions {
  name: string;
  owner: string;
  tags: string[];
  sets: string[];
}

export class CreateAlbumPresenter {
  public static inject = [TOKENS.CREATE_ALBUM];

  constructor(private readonly createAlbum: CreateAlbum) {
  }

  async execute(props: CreateAlbumPresenterOptions) {
    const album = Album.CREATE({
      owner:   new UserIdValueObject(props.owner),
      sets:    new SetValueObject(props.sets),
      name:    new NameValueObject(props.name),
      id:      new IdValueObject(0),
      total:   new NumberValueObject(0),
      current: new NumberValueObject(0),
      tags:    props.tags.map(t => ({ id: new IdValueObject(0), name: new NameValueObject(t) }))
    });

    return await this.createAlbum.execute(album);
  }
}
