import type { CreateAlbumCommand } from '~/app/album/application/DTO/CreateAblum.command';
import { Album }                   from '~/app/album/domain/models/album.model';
import { SetValueObject }          from '~/app/album/domain/models/set.valueObject';
import { CurrentValueObject }      from '~/app/album/domain/VO/Current.ValueObject';
import type { AlbumRepository }    from '~/app/album/infrastructure/album.repository';

import { TOKENS }            from '~/app/shared/binds/TOKENS';
import { IdValueObject }     from '~/app/shared/domain/VO/Id.ValueObject';
import { NameValueObject }   from '~/app/shared/domain/VO/Name.ValueObject';
import { NumberValueObject } from '~/app/shared/domain/VO/NumberValueObject';
import { UserIdValueObject } from '~/app/shared/domain/VO/UserId.ValueObject';

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
