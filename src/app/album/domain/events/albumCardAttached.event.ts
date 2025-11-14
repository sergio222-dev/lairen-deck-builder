import { DomainEvent } from '~/app/shared/domain/models/DomainEvent';

export class AlbumCardAttachedEvent extends DomainEvent {
  public readonly cardId: number;

  constructor(albumId: number, cardId: number) {
    super(albumId);
    this.cardId = cardId;
  }
}
