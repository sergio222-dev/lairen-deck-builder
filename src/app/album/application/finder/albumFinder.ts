import type { AlbumCardProjection } from '~/app/album/application/projection/AlbumCardProjection';

export interface AlbumFinder {
  getAllCardsInfoProjection(): Promise<AlbumCardProjection[]>;
}
