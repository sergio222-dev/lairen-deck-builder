import { DomainEvent } from '~/app/shared/domain/models/DomainEvent';

interface AlbumChangeEvent {
  tagId: number;
  cardId: number;
  amount: number;
}

export class AlbumChangesEvent extends DomainEvent {
  public changes: AlbumChangeEvent[]

  constructor(albumId: number, changes: AlbumChangeEvent[]) {
    super(albumId);
    this.changes = changes;
  }

}
