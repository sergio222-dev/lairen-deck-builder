import type { AlbumRawDto }       from '~/app/album/domain/DTO/albumRaw.dto';
import { AlbumCreatedEvent }      from '~/app/album/domain/events/albumCreated.event';
import { AlbumCard }              from '~/app/album/domain/models/albumCard.model';
import { AlbumCardTag }           from '~/app/album/domain/models/albumCardTag.model';
import { AlbumTag }               from '~/app/album/domain/models/albumTag.model';
import { AlbumChangeValueObject } from '~/app/album/domain/VO/albumChange.ValueObject';
import { CurrentValueObject }     from '~/app/album/domain/VO/current.ValueObject';
import { SetValueObject }         from '~/app/album/domain/VO/set.valueObject';
import { AggregateRoot }          from '~/app/shared/domain/models/aggregateRoot';
import { IdValueObject }          from '~/app/shared/domain/VO/id.valueObject';
import { NameValueObject }        from '~/app/shared/domain/VO/name.ValueObject';
import { NumberValueObject }      from '~/app/shared/domain/VO/number.valueObject';
import { StringValueObject }      from '~/app/shared/domain/VO/string.valueObject';
import { UserIdValueObject }      from '~/app/shared/domain/VO/userId.valueObject';
import { Logger }                 from '~/lib/logger';

interface AlbumConstructProps {
  id: IdValueObject;
  name: NameValueObject;
  tags: { id: IdValueObject; name: NameValueObject }[];
  sets: SetValueObject;
  owner: UserIdValueObject;
  total: NumberValueObject;
  current: CurrentValueObject;
}

export class Album extends AggregateRoot {
  private _cards: AlbumCard[]                = [];
  private _changes: AlbumChangeValueObject[] = [];

  private constructor(
    private readonly _id: IdValueObject,
    private readonly _name: NameValueObject,
    private readonly _tags: AlbumTag[],
    private readonly _sets: SetValueObject,
    private readonly _owner: UserIdValueObject,
    private readonly _current: CurrentValueObject,
    private readonly _total: NumberValueObject
  ) {
    super();
  }

  static CREATE(data: AlbumConstructProps) {
    const { id, name, tags, sets, owner, current, total } = data;

    const albumTags = tags.map((t) =>
      AlbumTag.CREATE({
        name: t.name,
        id:   t.id
      })
    );

    const album = new Album(id, name, albumTags, sets, owner, current, total);

    album._events.push(new AlbumCreatedEvent(0));

    return album;
  }

  static HYDRATE(data: AlbumRawDto) {
    const a = new Album(
      new IdValueObject(data.id),
      new NameValueObject(data.name),
      data.album_tags.map((t) =>
        AlbumTag.CREATE({
          id:   new IdValueObject(t.id),
          name: new NameValueObject(t.name)
        })
      ),
      new SetValueObject(data.sets),
      new UserIdValueObject(data.owner),
      new CurrentValueObject(data.current),
      new NumberValueObject(data.total)
    );

    const cardMap = data.album_cards
      .reduce(
        (a, v) => {
          let albumCard: AlbumCard;

          if (!a[v.cards.id]) {
            albumCard = new AlbumCard(
              new IdValueObject(v.cards.id),
            );
            a[v.cards.id]   = albumCard;
          }

          return a;
        },
        {} as Record<string, AlbumCard>
      );

    a._cards = Object.values(cardMap);

    return a;
  }

  get cards() {
    return this._cards;
  }

  get id(): IdValueObject {
    return this._id;
  }

  get name(): NameValueObject {
    return this._name;
  }

  get tags(): AlbumTag[] {
    return this._tags;
  }

  get sets(): SetValueObject {
    return this._sets;
  }

  get owner(): UserIdValueObject {
    return this._owner;
  }

  get current(): NumberValueObject {
    return this._current;
  }

  get total(): NumberValueObject {
    return this._total;
  }

  get changes() {
    return this._changes;
  }

  attachCard(cardId: IdValueObject) {
    const card = new AlbumCard(cardId);

    if (this._cards.find((c) => c.cardId.equals(cardId))) {
      throw new Error('Card already exists in the album');
    }

    this.tags.forEach((t) => {
      const change = new AlbumChangeValueObject(cardId.value, t.id.value, 0);
      this._changes.push(change);
      // const tag = new AlbumCardTag(t.id, t.name, NumberValueObject.ZERO);
      // card.addTag(tag);
    });

    this._cards.push(card);

    // this._events.push(new AlbumCardAttachedEvent(this.id.value, id.value));
  }

  // addChanges(changes: AlbumChangeValueObject[]) {
  //   changes.forEach((change) => {
  //     this.addChange(change);
  //   });
  // }

  addChange(change: AlbumChangeValueObject) {
    const cardId = change.props.cardId;
    // const tagId  = change.props.tagId;
    // const amount = change.props.amount;

    const card = this.cards.find((c) => c.cardId.equals(cardId));

    if (!card) {
      throw new Error(
        `Cannot change quantity card: ${cardId.value} because the card is not in the album`
      );
    }

    // check if change already in changes
    const indexChange = this._changes.findIndex((c) =>
      c.props.cardId.equals(this.id)
    );

    if (indexChange < 0) {
      this._changes = [...this._changes, change];
    } else {
      this._changes[indexChange] = change;
    }
  }
}
