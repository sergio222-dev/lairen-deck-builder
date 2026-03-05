interface Album_Get_Tag {
  id: number;
  name: string;
}

interface Album_Get_Card_Tag {
  id: number;
  name: string;
  quantity: number;
}

interface Album_Get_Card {
  id: number;
  name: string;
  image: string;
  tags: Album_Get_Card_Tag[];
}

interface Album_Get_Rpc_Data {
  cursor: string;
  album_cards: Album_Get_Card[] | null;
}
