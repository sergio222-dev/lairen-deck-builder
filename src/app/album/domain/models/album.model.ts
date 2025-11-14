import { AlbumCardAttachedEvent }      from '~/app/album/domain/events/albumCardAttached.event';
import { AlbumChangesEvent }           from '~/app/album/domain/events/albumChangesEvent';
import { AlbumCreatedEvent }           from '~/app/album/domain/events/albumCreated.event';
import { AlbumCurrentChanged }         from '~/app/album/domain/events/albumCurrentChanged';
import { AlbumCard }                   from '~/app/album/domain/models/albumCard.model';
import { AlbumCardTag }                from '~/app/album/domain/models/albumCardTag.model';
import { AlbumTag }         from '~/app/album/domain/models/albumTag.model';
import type { AlbumRawDto } from '~/app/album/domain/DTO/AlbumRaw.dto';
import { SetValueObject }              from '~/app/album/domain/models/set.valueObject';
import type { AlbumChangeValueObject } from '~/app/album/domain/VO/AlbumChange.ValueObject';
import { CurrentValueObject }          from '~/app/album/domain/VO/Current.ValueObject';
import { AggregateRoot }     from '~/app/shared/domain/models/AggregateRoot';
import { IdValueObject }     from '~/app/shared/domain/VO/Id.ValueObject';
import { NameValueObject }   from '~/app/shared/domain/VO/Name.ValueObject';
import { NumberValueObject } from '~/app/shared/domain/VO/NumberValueObject';
import { UserIdValueObject } from '~/app/shared/domain/VO/UserId.ValueObject';
import { Logger }            from '~/lib/logger';

interface AlbumConstructProps {
  id: IdValueObject;
  name: NameValueObject;
  tags: { id: IdValueObject, name: NameValueObject }[];
  sets: SetValueObject;
  owner: UserIdValueObject;
  total: NumberValueObject;
  current: CurrentValueObject;
}

export class Album extends AggregateRoot {
  private _cards: AlbumCard[] = [];

  private constructor(private readonly _id: IdValueObject,
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

    const albumTags = tags.map(t => AlbumTag.CREATE({
      name: t.name,
      id:   t.id
    }));

    const album = new Album(id, name, albumTags, sets, owner, current, total);

    album._events.push(new AlbumCreatedEvent(0));

    return album;
  }

  static HYDRATE(data: AlbumRawDto) {
    const a = new Album(
      new IdValueObject(data.id),
      new NameValueObject(data.name),
      data.album_tag.map(t => AlbumTag.CREATE({
        id:   new IdValueObject(t.id),
        name: new NameValueObject(t.name)
      })),
      new SetValueObject(data.sets),
      new UserIdValueObject(data.owner),
      new CurrentValueObject(data.current),
      new NumberValueObject(data.total)
    );

    a._cards = data.album_cards
      .toSorted((a, b) => a.cards!.name.localeCompare(b.cards!.name))
      .map(c => {
        if (!c.cards) throw new Error('AlbumCards must be an array!');

        // create tags
        const tags = c.album_card_tags.map(tag => {
          if (!tag.album_tag) throw new Error('AlbumCardTag requires at least one album');

          return new AlbumCardTag(
            new IdValueObject(tag.album_tag.id),
            new NameValueObject(tag.album_tag.name),
            new NumberValueObject(tag.quantity)
          );
        });

        const card = new AlbumCard(
          new IdValueObject(c.cards.id)
        );

        tags.forEach(t => {
          card.addTag(t);
        });
        // card._cardTags = tags;

        // return AlbumCard.HYDRATE(c);
        return card;
      });

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

  attachCard(id: IdValueObject) {
    const card = new AlbumCard(id);

    this.cards.push(card);

    this._events.push(new AlbumCardAttachedEvent(this.id.value, id.value));
  }

  addChange(change: AlbumChangeValueObject) {
    const cardId = change.props.cardId;
    const tagId  = change.props.tagId;
    const amount = change.props.amount;

    const card = this.cards.find(c => c.id.equals(cardId));

    if (!card) {
      throw new Error(`Cannot add card: ${cardId.value} because the card is not in the album`);
    }

    const previousQuantity = card.getTotalQuantity();

    card.addCardTag(tagId, amount);
    const currentQuantity = card.getTotalQuantity();

    if (previousQuantity.isZero && !currentQuantity.isZero) {
      this.current.increase();

      Logger.debug(this.current.value, `INCREASED CURRENT`)

      const e = this._events.find(evt => evt instanceof AlbumCurrentChanged);

      if (!e) {
        this._events.push(new AlbumCurrentChanged(this.id.value, 1, this.current.value));
      } else {
        (e as AlbumCurrentChanged).increasedAmount++;
        (e as AlbumCurrentChanged).currentValue = this.current.value;
      }
    }

    if (currentQuantity.isZero && !previousQuantity.isZero) {
      this.current.decrease();

      Logger.debug(this.current.value, `INCREASED CURRENT`)

      const e = this._events.find(evt => evt instanceof AlbumCurrentChanged);

      if (!e) {
        this._events.push(new AlbumCurrentChanged(this.id.value, -1, this.current.value));
      } else {
        (e as AlbumCurrentChanged).increasedAmount--;
        (e as AlbumCurrentChanged).currentValue = this.current.value;
      }

    }

    const newAmount = card.getQuantity(tagId);

    const changeEventBatch = this._events.find(e => e instanceof AlbumChangesEvent);

    if (!changeEventBatch) {
      const changesEvent = new AlbumChangesEvent(this.id.value, [
        {
          amount: newAmount.value,
          tagId:  tagId.value,
          cardId: cardId.value
        }
      ]);
      this._events.push(changesEvent);
    } else {
      (changeEventBatch as AlbumChangesEvent).changes.push({
        tagId:  tagId.value,
        cardId: cardId.value,
        amount: newAmount.value
      });
    }
  }
}
