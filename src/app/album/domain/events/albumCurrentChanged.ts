import { DomainEvent } from '~/app/shared/domain/models/DomainEvent';

export class AlbumCurrentChanged extends DomainEvent {
  public increasedAmount: number;
  public currentValue: number;

  constructor(albumId: number, value: number, currentValue: number) {
    super(albumId);
    this.increasedAmount = value;
    this.currentValue = currentValue;
  }
}
