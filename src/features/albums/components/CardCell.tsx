import { component$, useContext }         from "@builder.io/qwik";
import { Button }                         from "~/components/button";
import { ALBUM_VIEW_CONTEXT, getUIDCard } from "~/UI/album/store/albumView.store";
import styles                             from "../styles.module.scss";

type CardCellProps = {
    cardId: number;
}

export const CardCell = component$<CardCellProps>(({ cardId }) => {
    const a    = useContext(ALBUM_VIEW_CONTEXT)

    const card = a.cards[cardId];
    const tags = Object.keys(card.tags).map(tag => getUIDCard(cardId, tag));

    return (
            <>
                {tags.map(tag => (
                        <th key={tag}>
                            <Button
                                    class={`${styles['btn-action']} mx-1`}
                                    onClick$={() => a.increaseQuantity(cardId, a.cardTags[tag].id)}
                            >
                                +
                            </Button>
                            {a.cardTags[tag].quantity + (a.changes?.[tag]?.amount ?? 0)}
                            <Button
                                    class={`${styles['btn-action']} mx-1`}
                                    onClick$={() => a.decreaseQuantity(cardId, a.cardTags[tag].id)}
                            >
                                -
                            </Button>
                        </th>
                ))}
            </>
    )
})
