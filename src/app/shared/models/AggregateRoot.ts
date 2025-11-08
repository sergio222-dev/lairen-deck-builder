import type { DomainEvent } from '~/app/shared/models/DomainEvent';

export abstract class AggregateRoot {
  protected _events: DomainEvent[] = [];

  public pullEvents() {
    return this._events;
  }
}
