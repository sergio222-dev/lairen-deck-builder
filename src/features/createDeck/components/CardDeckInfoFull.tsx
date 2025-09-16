import { component$, useContext } from '@builder.io/qwik';
import { CardDeckControl }       from '~/features/createDeck/components/CardDeckControl';
import { DECK_CREATION_CONTEXT } from "~/UI/deck/store/deckCreation.store";

export const CardDeckInfoFull = component$(
        () => {
            const deck = useContext(DECK_CREATION_CONTEXT);

            return (
                    <>
                        <div class="gap-4">
                            <div>
                                <p class="text-[1rem] font-bold py-2 border-primary border-y-2 my-2">Unidades
                                    ({deck.quantityUnitsCards})</p>
                                <div class="flex flex-wrap">
                                    {deck.orderedUnitCards.map(id => (
                                            <CardDeckControl orientation="horizontal" key={id} cardId={id}/>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p class="text-[1rem] font-bold py-2 border-primary border-y-2 my-2">Acciones
                                    ({deck.quantityActionsCards})</p>
                                <div class="flex flex-wrap">
                                    {deck.orderedActionCards.map(id => (
                                            <CardDeckControl orientation="horizontal" key={id} cardId={id}/>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {deck.quantityMonumentsWeaponsCards > 0 &&
                                <div>
                                    <p class="text-[1rem] font-bold py-2 border-primary border-y-2 my-2">Monumentos y
                                        Armas
                                        ({deck.quantityMonumentsWeaponsCards})</p>
                                    <div class="flex flex-wrap">
                                        {deck.orderedMonumentWeaponCards.map(id => (
                                                <CardDeckControl orientation="horizontal" key={id} cardId={id}/>
                                        ))}
                                    </div>
                                </div>
                        }

                        <div>
                            <p class="text-[1rem] font-bold py-2 border-primary border-y-2 my-2">Tesoros
                                ({deck.quantityInTreasureDeck})
                                Puntos: {deck.treasurePoints}</p>
                            <div class="flex flex-wrap">
                                {deck.orderedTreasureCards.map(id => (
                                        <CardDeckControl orientation="horizontal" key={id} cardId={id}/>
                                ))}
                            </div>
                        </div>

                        {deck.quantityInSideDeck > 0 &&
                                <div>
                                    <p class="text-[1rem] font-bold py-2 border-primary border-y-2 my-2">Side
                                        ({deck.quantityInSideDeck})</p>
                                    <div class="flex flex-wrap">
                                        {deck.orderedSideCards.map(id => (
                                                <CardDeckControl orientation="horizontal" isSide key={id} cardId={id}/>
                                        ))}
                                    </div>
                                </div>
                        }
                    </>
            );
        });
