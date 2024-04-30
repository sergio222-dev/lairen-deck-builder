import { server$, z } from "@builder.io/qwik-city";
import { cardGetScheme } from "~/models/schemes/cardGet";
import { CardRepository } from "~/providers/repositories/CardRepository";

export const serverCard = server$(async function (filters: z.infer<typeof cardGetScheme>) {

    const result = cardGetScheme.safeParse(filters);

    if (!result.success) {
        throw new Error(result.error.message);
    }

    const cardRepo = new CardRepository();

    const cards = await cardRepo.getCardList(result.data);
    const count = await cardRepo.getCount(result.data);

    return {
        cards,
        count,
    }
});
