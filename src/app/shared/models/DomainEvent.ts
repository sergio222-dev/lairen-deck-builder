export abstract class DomainEvent {
  public readonly albumId: number;

  constructor(albumId: number) {
    this.albumId = albumId;
  }
}
