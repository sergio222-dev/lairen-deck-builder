import { component$, useContext } from "@builder.io/qwik";
import { Link }                   from "@builder.io/qwik-city";

import { Button } from "~/components/button";
import { Chip }   from "~/components/chip/Chip";

import { CardCell }         from "~/features/albums/components/CardCell";
import { CardSearchToAdd }  from "~/features/albums/components/CardSearchToAdd";
import { CollectionSearch } from "~/features/albums/components/CollectionSearch";

import { ALBUM_VIEW_CONTEXT } from "~/UI/album/store/albumView.store";
import { CARD_VIEW_CONTEXT }  from "~/UI/card/store/cardViewer.storet";

import styles from "./styles.module.scss";

const TableCard = component$(() => {
    const a = useContext(ALBUM_VIEW_CONTEXT);
    const v = useContext(CARD_VIEW_CONTEXT)

    return (
            <table class={`${styles['table-collection']} w-full`}>
                <thead>
                <tr>
                    <th>Name</th>
                    {a.tags.map((t, i) => (
                            <th key={i}>{t}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {a.filteredCards.map(c => (
                        <tr key={c}>
                            <th onClick$={() => v.showCard(c)}>{a.cards[c].name}</th>
                            <CardCell cardId={c}/>
                        </tr>
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
                        <div class="flex gap-2 mt-2">
                            {a.sets.map(s => (
                                    <Chip key={s}>{s}</Chip>
                            ))}
                        </div>
                        <div class="flex gap-2 mt-2">
                            {a.tags.map(tag => (
                                    <Chip key={tag}>
                                        {tag} <span class="bg-black text-white rounded-full px-2">{a.totalTags[tag] ??
                                            0}</span>
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
