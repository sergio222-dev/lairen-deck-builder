export interface AlbumStatsProjection {
  stats: {
    id: number;
    total: number;
    name: string;
  }[]
}
