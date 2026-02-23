import type { DomainEvent } from '~/app/shared/domain/models/domainEvent';

export abstract class AggregateRoot {
  protected _events: DomainEvent[] = [];

  public pullEvents() {
    return this._events;
  }
}
