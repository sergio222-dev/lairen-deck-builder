import { $, component$, Signal, useContext, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Link }                                                          from "@builder.io/qwik-city";

import { Button } from "~/components/button";
import { Chip }   from "~/components/chip/Chip";

import { CardCell }         from "~/features/albums/components/CardCell";
import { CardSearchToAdd }  from "~/features/albums/components/CardSearchToAdd";
import { CollectionSearch } from "~/features/albums/components/CollectionSearch";
import { AppContext }       from "~/stores/appContext";

import { ALBUM_VIEW_CONTEXT } from "~/UI/album/store/albumView.store";
import { CARD_VIEW_CONTEXT }  from "~/UI/card/store/cardViewer.storet";

import styles from "./styles.module.scss";

const TableRow = component$<{ cardId: number, forwardRef: Signal<HTMLTableRowElement | undefined> | undefined}>(({ cardId, forwardRef}) => {
    const v   = useContext(CARD_VIEW_CONTEXT)
    const a   = useContext(ALBUM_VIEW_CONTEXT);

    return (
            <tr ref={forwardRef}>
                <th class={`cursor-pointer`} onClick$={() => v.showCard(cardId)}>{a.cards[cardId].name}</th>
                <CardCell cardId={cardId}/>
            </tr>
    )
})

const TableCard = component$(() => {
    const app = useContext(AppContext);
    const a   = useContext(ALBUM_VIEW_CONTEXT);

    const ref = useSignal<HTMLTableRowElement>();

    const handleObserver = $(async (entries: IntersectionObserverEntry[]) => {
        if (!entries[0].isIntersecting) return;
        if (app.isLoading) return;
        app.isLoading = true;
        await a.fetchNext()
        app.isLoading = false
    });

    useVisibleTask$(({track}) => {
        track(ref)

        const option = {
            root:       null,
            rootMargin: "200px",
            threshold:  1,
        }

        const observer = new IntersectionObserver(handleObserver, option);
        if (ref.value) observer.observe(ref.value);

        return () => {
            if (ref.value) observer.disconnect();
        }
    })

    return (
            <table class={`${styles['table-collection']} w-full`}>
                <thead>
                <tr>
                    <th>Name</th>
                    {a.tagsById.map((t) => (
                            <th key={t}>{a.tags[t].name}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {a.cardsById.map((c, i) => (
                       <TableRow forwardRef={i === a.cardsById.length - 1 ?  ref : undefined}  key={c} cardId={c} />
                ))}
                </tbody>
            </table>
    )
});

export const EditAlbum = component$(() => {
    const a = useContext(ALBUM_VIEW_CONTEXT);

    return (
            <div class="overflow-y-auto px-6 py-7 w-full">
                <div>
                    <Link href="/album">
                        <Button>Back to Album</Button>
                    </Link>
                </div>

                <CardSearchToAdd/>

                <div class="flex items-start justify-between mb-4 border-2 rounded-xl p-6 mt-2">
                    <div>
                        <div class="flex gap-2 flex-wrap">
                            <h1>{a.name}</h1>
                            <div class="flex gap-2">
                                {!a.editMode && (
                                        <Button style={{ paddingTop: 0, paddingBottom: 0 }}
                                                onClick$={() => a.editMode = !a.editMode}>
                                            Editar
                                        </Button>
                                )}
                                {a.editMode && (
                                        <>
                                            <Button style={{ paddingTop: 0, paddingBottom: 0 }}
                                                    onClick$={async () => {
                                                        await a.saveChanges();
                                                    }}>
                                                Guardar
                                            </Button>
                                            <Button style={{ paddingTop: 0, paddingBottom: 0 }}
                                                    onClick$={() => {
                                                        void a.resetChanges()
                                                        a.editMode = false;
                                                    }}>
                                                Cancelar
                                            </Button>
                                        </>
                                )}
                            </div>
                        </div>
                        <div class="flex flex-wrap gap-2 mt-2">
                            {a.sets.map(s => (
                                    <Chip key={s}>{s}</Chip>
                            ))}
                        </div>
                        <div class="flex flex-wrap gap-2 mt-2">
                            {a.tagsById.map(tag => (
                                    <Chip key={tag}>
                                        {a.tags[tag].name} <span
                                            class="bg-black text-white rounded-full px-2">{a.tags[tag].total}</span>
                                    </Chip>
                            ))}
                        </div>
                    </div>
                </div>

                <CollectionSearch/>

                <div class="flex justify-center">
                    <div
                            data-edit={a.editMode ? "true" : "false"}
                            class={`${styles['card-list']} max-w-screen-2xl flex-1 overflow-x-scroll`}>
                        <TableCard/>
                    </div>
                </div>
            </div>
    );
});
