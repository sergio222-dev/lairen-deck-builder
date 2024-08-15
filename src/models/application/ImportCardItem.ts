export interface ImportCardItem {
  name: string;
  quantity: number;
}

export interface ImportDeckRequest {
  realm: ImportCardItem[];
  treasure: ImportCardItem[];
  side: ImportCardItem[];
}
