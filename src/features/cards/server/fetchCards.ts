import { RequestEventBase, server$, ServerFunction, z } from '@builder.io/qwik-city';
import { CardRepository }                               from '~/app/card/infrastructure/card.repository';
import { Card }                                         from '~/models/Card';
import { FetchCardsPayload }                            from "~/models/infrastructure/FetchCardsPayload";

interface ServerCardResponse {
    cards: Card[];
    count: number;
}

type ServerCardRequest = (this: RequestEventBase,filters: FetchCardsPayload) => Promise<ServerCardResponse>

export const serverFetchCards = server$<ServerCardRequest>(async function (filters ) {
    const cardRepo = new CardRepository(this);

    const cards = await cardRepo.getCardList(filters);
    const count = await cardRepo.getCount(filters);

    return {
        cards,
        count,
    }
});
