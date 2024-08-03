import { RequestEventBase, server$, ServerFunction, z } from '@builder.io/qwik-city';
import { Card }                                         from '~/models/Card';
import { FetchCardsPayload }                            from "~/models/infrastructure/FetchCardsPayload";
import { cardGetScheme } from "~/models/schemes/cardGet";
import { CardRepository } from "~/providers/repositories/CardRepository";

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
