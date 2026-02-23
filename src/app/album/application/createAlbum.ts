import type { CreateAlbumCommand } from '~/app/album/application/DTO/createAblum.command';
import { Album }                   from '~/app/album/domain/models/album.model';
import { CurrentValueObject }      from '~/app/album/domain/VO/current.ValueObject';
import { SetValueObject }          from '~/app/album/domain/VO/set.valueObject';
import type { AlbumRepository }    from '~/app/album/infrastructure/album.repository';

import { TOKENS }          from '~/app/shared/binds/TOKENS';
import { IdValueObject }   from '~/app/shared/domain/VO/id.valueObject';
import { NameValueObject } from '~/app/shared/domain/VO/name.ValueObject';
import { NumberValueObject } from '~/app/shared/domain/VO/number.valueObject';
import { UserIdValueObject } from '~/app/shared/domain/VO/userId.valueObject';

export class CreateAlbum {

  public static inject = [TOKENS.ALBUM_REPOSITORY] as const;

  constructor(private readonly albumRepository: AlbumRepository) {
  }

  async execute(options: CreateAlbumCommand) {

    const album = Album.CREATE({
      owner:   new UserIdValueObject(options.owner),
      sets:    new SetValueObject(options.sets),
      name:    new NameValueObject(options.name),
      id:      new IdValueObject(0),
      total:   new NumberValueObject(0),
      current: new CurrentValueObject(0),
      tags:    options.tags.map(t => ({ id: new IdValueObject(0), name: new NameValueObject(t) }))
    });


    return await this.albumRepository.saveAlbum(album);
  }
}
