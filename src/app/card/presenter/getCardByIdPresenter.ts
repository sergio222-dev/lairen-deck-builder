import type { GetCardById } from '~/app/card/application/getCardById';
import { TOKENS }        from '~/app/shared/binds/TOKENS';
import { IdValueObject } from '~/app/shared/domain/VO/id.valueObject';

import type { UICard } from '~/UI/card/models/card.model';

export class GetCardByIdPresenter {
  static readonly inject = [TOKENS.GET_CARD_BY_ID];

  constructor(private getCardById: GetCardById) {
  }

  async execute(cardId: number): Promise<UICard> {
    const c = await this.getCardById.execute(cardId);

    return {
      id:             c.id.value,
      type:           c.type.value,
      cost:           c.cost.value,
      image:          c.image.value,
      name:           c.name.value,
      set:            c.set.value,
      rarity:         c.rarity.value,
      subtype1:       c.subtype1.value,
      subtype2:       c.subtype2.value,
      text:           c.text.value,
      clarifications: c.clarifications ? c.clarifications.value : null,
      thumbnail:      c.thumbnail.value,
      supertype:      c.supertype.value
    };

  }
}
