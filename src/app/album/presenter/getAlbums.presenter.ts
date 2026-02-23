import type { AlbumRepository } from '~/app/album/infrastructure/album.repository';
import type { User }            from '~/app/shared/application/DTO/user.dto';
import { TOKENS }              from '~/app/shared/binds/TOKENS';
import { UserIdValueObject }   from '~/app/shared/domain/VO/userId.valueObject';
import type { UIAlbumPreview } from '~/UI/album/models/album.model';

export class GetAlbumsPresenter {
  static readonly inject = [TOKENS.ALBUM_REPOSITORY, TOKENS.CURRENT_USER];

  constructor(private readonly albumRepository: AlbumRepository, private readonly getCurrentUser: () => User | null) {
  }

  async execute(): Promise<UIAlbumPreview[]> {
    const owner = this.getCurrentUser();

    if (!owner) {
      return [];
    }

    const albums = await this.albumRepository.listByUserOwner(new UserIdValueObject(owner.id));

    return albums.map(a => ({
      name:    a.name.value,
      id:      a.id.value,
      current: a.current.value,
      total:   a.total.value
    }));
  }
}
