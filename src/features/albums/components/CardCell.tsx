import { component$, useContext }         from "@builder.io/qwik";
import { Button }                         from "~/components/button";
import { ALBUM_VIEW_CONTEXT, getUIDCard } from "~/UI/album/store/albumView.store";
import styles                             from "../styles.module.scss";

type CardCellProps = {
    cardId: number;
}

export const CardCell = component$<CardCellProps>(({ cardId }) => {
    const a    = useContext(ALBUM_VIEW_CONTEXT)

    return (
            <>
                {a.tagsById.map(tag => (
                        <th key={getUIDCard(cardId, tag)}>
                            <Button
                                    class={`${styles['btn-action']} mx-1`}
                                    onClick$={() => a.increaseQuantity(cardId, tag)}
                            >
                                +
                            </Button>
                            {a.cards[cardId].tags[tag].quantity + (a.changes?.[getUIDCard(cardId, tag)]?.amount ?? 0)}
                            <Button
                                    class={`${styles['btn-action']} mx-1`}
                                    onClick$={() => a.decreaseQuantity(cardId, tag)}
                            >
                                -
                            </Button>
                        </th>
                ))}
            </>
    )
})
