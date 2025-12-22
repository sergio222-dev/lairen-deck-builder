import type { AlbumRepository } from '~/app/album/infrastructure/album.repository';
import { TOKENS }               from '~/app/shared/binds/TOKENS';
import type { UserRepository }  from '~/app/user/infrastructure/user.repository';
import type { UIAlbumPreview }  from '~/UI/album/models/album.model';

export class GetAlbumsPresenter {
  static readonly inject = [TOKENS.ALBUM_REPOSITORY, TOKENS.USER_REPOSITORY]

  constructor(private readonly albumRepository: AlbumRepository, private readonly userRepository: UserRepository) {
  }

  async execute(): Promise<UIAlbumPreview[]> {
    const owner  = await this.userRepository.getCurrentUser();
    const albums = await this.albumRepository.listByUserOwner(owner.id);

    return albums.map(a => ({
      name:    a.name.value,
      id:      a.id.value,
      current: a.current.value,
      total:   a.total.value
    }));
  }
}
