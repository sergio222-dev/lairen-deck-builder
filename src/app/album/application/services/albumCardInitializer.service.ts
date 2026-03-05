import { IdValueObject } from '~/app/shared/domain/VO/id.valueObject';

export interface AlbumCardInitializerService {
  initializeAlbumCards(albumId: IdValueObject): Promise<void>;
}
