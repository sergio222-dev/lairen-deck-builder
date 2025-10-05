import { component$, useContext } from "@builder.io/qwik";
import { CardDeckControlPreview } from "~/features/preview/components/CardDeckControlPreview";
import { DECK_PREVIEW_CONTEXT }   from "~/UI/deck/store/deckPreview.store";


export const CardDeckInfoPreview = component$(() => {

    const d = useContext(DECK_PREVIEW_CONTEXT);

    return (
            <div class="shadow-lg m-4">
                <div class="flex justify-center gap-4">
                    <p class="text-center">Total number of cards in deck:<br/>{d.quantityInMainDeck}</p>
                </div>

                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <p class="text-[2rem] py-2 border-primary border-y-2 my-2">Unidades ({d.quantityUnitsCards})</p>
                        <div class="flex flex-wrap">
                            {d.orderedUnitCards.map(c => (
                                    <CardDeckControlPreview key={c} cardId={c}/>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p class="text-[2rem] py-2 border-primary border-y-2 my-2">Acciones
                            ({d.quantityActionsCards})</p>
                        <div class="flex flex-wrap">
                            {d.orderedActionCards.map(c => (
                                    <CardDeckControlPreview key={c} cardId={c}/>
                            ))}
                        </div>
                    </div>
                </div>

                {d.quantityMonumentsWeaponsCards > 0 &&
                        <div class="p-4">
                            <p class="text-[2rem] py-2 border-primary border-y-2 my-2">Monumentos y Armas
                                ({d.quantityMonumentsWeaponsCards})</p>
                            <div class="flex flex-wrap">
                                {d.orderedMonumentWeaponCards.map(c => (
                                        <CardDeckControlPreview orientation="horizontal" key={c} cardId={c}
                                        />
                                ))}
                            </div>
                        </div>
                }
                <div class="p-4">
                    <p class="text-[2rem] py-2 border-primary border-y-2 my-2">Tesoros ({d.quantityInTreasureDeck})
                        Puntos: {d.treasurePoints}</p>
                    <div class="flex flex-wrap">
                        {d.orderedTreasureCards.map(c => (
                                <CardDeckControlPreview orientation="horizontal" key={c} cardId={c}/>
                        ))}
                    </div>
                </div>

                {d.quantityInSideDeck > 0 &&
                        <div class="p-4">
                            <p class="text-[2rem] py-2 border-primary border-y-2 my-2">Side ({d.quantityInSideDeck})</p>
                            <div class="flex flex-wrap">
                                {d.orderedSideCards.map(c => (
                                        <CardDeckControlPreview orientation="horizontal" isSide key={c} cardId={c}
                                        />
                                ))}
                            </div>
                        </div>
                }
            </div>
    );
});
