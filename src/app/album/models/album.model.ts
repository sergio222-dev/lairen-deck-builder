import { AlbumCardAttachedEvent } from '~/app/album/events/albumCardAttached.event';
import { AlbumCreatedEvent }      from '~/app/album/events/albumCreated.event';
import { AlbumCard }              from '~/app/album/models/albumCard.model';
import { AlbumCardTag }           from '~/app/album/models/albumCardTag.model';
import { AlbumTag }               from '~/app/album/models/albumTag.model';
import type { AlbumRawDto }       from '~/app/album/models/DTO/AlbumRaw.dto';
import { SetValueObject }         from '~/app/album/models/set.valueObject';
import { AggregateRoot }          from '~/app/shared/models/AggregateRoot';
import { IdValueObject }          from '~/app/shared/models/VO/Id.ValueObject';
import { NameValueObject }        from '~/app/shared/models/VO/Name.ValueObject';
import { NumberValueObject }      from '~/app/shared/models/VO/NumberValueObject';
import { StringValueObject }      from '~/app/shared/models/VO/StringValueObject';
import { UserIdValueObject }      from '~/app/shared/models/VO/UserId.ValueObject';

interface AlbumConstructProps {
  id: IdValueObject;
  name: NameValueObject;
  tags: { id: IdValueObject, name: NameValueObject }[];
  sets: SetValueObject;
  owner: UserIdValueObject;
  total: NumberValueObject;
  current: NumberValueObject;
}

export class Album extends AggregateRoot {
  private _cards: AlbumCard[] = [];

  private constructor(private readonly _id: IdValueObject,
                      private readonly _name: NameValueObject,
                      private readonly _tags: AlbumTag[],
                      private readonly _sets: SetValueObject,
                      private readonly _owner: UserIdValueObject,
                      private readonly _current: NumberValueObject,
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
      new NumberValueObject(data.current),
      new NumberValueObject(data.total)
    );

    a._cards = data.album_cards.map(c => {
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
        new IdValueObject(c.cards.id),
        new NameValueObject(c.cards.name),
        new StringValueObject(c.cards.image)
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
    const card = new AlbumCard(id, new NameValueObject(''), new StringValueObject(''));

    this.cards.push(card);

    this._events.push(new AlbumCardAttachedEvent(this.id.value, id.value));
  }
}
