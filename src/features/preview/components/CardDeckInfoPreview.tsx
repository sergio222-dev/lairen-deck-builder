import { component$, useContext } from "@builder.io/qwik";
import { Tab }                    from "~/components/tab/Tab";
import { CardDeckControlPreview } from "~/features/preview/components/CardDeckControlPreview";
import { DECK_PREVIEW_CONTEXT }   from "~/UI/deck/store/deckPreview.store";


export const CardDeckInfoPreview = component$(() => {

    const d = useContext(DECK_PREVIEW_CONTEXT);

    return (
            <div class="shadow-lg m-4">
                <div class="flex justify-center gap-4">
                    <div class="border-[var(--qwik-secondary)] border-2 p-4 flex flex-col items-center rounded">
                        Cards in deck <span class="text-green-400 text-[2rem]">{d.quantityInMainDeck}</span>
                    </div>
                </div>


                <div class="grid md:grid-cols-2 gap-4">
                    <Tab class="mt-2">
                        <div q:slot="title">
                            <p class="font-bold">
                                Unidades <span class="text-green-400">({d.quantityUnitsCards})</span>
                            </p>
                        </div>
                        {d.orderedUnitCards.map(c => (
                                <CardDeckControlPreview key={c} cardId={c}/>
                        ))}
                    </Tab>
                    <Tab class="mt-2">
                        <div q:slot="title">
                            <p class="font-bold">
                                Acciones <span class="text-green-400">({d.quantityActionsCards})</span>
                            </p>
                        </div>
                        {d.orderedActionCards.map(c => (
                                <CardDeckControlPreview key={c} cardId={c}/>
                        ))}
                    </Tab>
                </div>

                {d.quantityMonumentsWeaponsCards > 0 &&
                        <Tab class="mt-2">
                            <div q:slot="title">
                                <p class="font-bold">
                                    Monumentos y Armas <span
                                        class="text-green-400">({d.quantityMonumentsWeaponsCards})</span>
                                </p>
                            </div>
                            {d.orderedMonumentWeaponCards.map(c => (
                                    <CardDeckControlPreview orientation="horizontal" key={c} cardId={c}
                                    />
                            ))}
                        </Tab>
                }
                <Tab class="mt-2">
                    <div q:slot="title">
                        <p class="font-bold">
                            Tesoros <span class="text-green-400">({d.quantityInTreasureDeck}) </span>
                            Puntos: <span class="text-blue-400">{d.treasurePoints} </span>
                        </p>
                    </div>
                    {d.orderedTreasureCards.map(c => (
                            <CardDeckControlPreview orientation="horizontal" key={c} cardId={c}/>
                    ))}
                </Tab>

                {d.quantityInSideDeck > 0 &&
                        <Tab class="mt-2">
                            <div q:slot="title">
                                <p class="font-bold">
                                    Side <span class="text-green-400">({d.quantityInSideDeck})</span>
                                </p>
                            </div>
                            {d.orderedSideCards.map(c => (
                                    <CardDeckControlPreview orientation="horizontal" isSide key={c} cardId={c}
                                    />
                            ))}
                        </Tab>
                }
            </div>
    );
});
