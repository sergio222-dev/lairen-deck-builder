import type { AlbumRepository } from '~/app/album/infrastructure/album.repository';
import { UserIdValueObject }    from '~/app/shared/models/VO/UserId.ValueObject';

export async function getAlbums(albumRepository: AlbumRepository, owner: string) {
  const ownerId = new UserIdValueObject(owner);
  return albumRepository.listByUserOwner(ownerId);
}
