import { component$, useContext } from '@builder.io/qwik';
import { CardDeckControl }       from '~/features/createDeck/components/CardDeckControl';
import { Tab }                   from "~/components/tab/Tab";
import { DECK_CREATION_CONTEXT } from "~/UI/deck/store/deckCreation.store";

export const CardDeckInfoFull = component$(
        () => {
            const deck = useContext(DECK_CREATION_CONTEXT);

            return (
                    <>
                        <div class="gap-4">
                            <Tab class="mt-2">
                                <div q:slot="title">
                                    <p class="text-[1rem] font-bold">
                                        Unidades <span class="text-green-400">({deck.quantityUnitsCards})</span>
                                    </p>
                                </div>
                                {deck.orderedUnitCards.map(id => (
                                        <CardDeckControl orientation="horizontal" key={id} cardId={id}/>
                                ))}
                            </Tab>
                            <Tab class="mt-2">
                                <div q:slot="title">
                                    <p class="text-[1rem] font-bold">
                                        Acciones <span class="text-green-400">({deck.quantityActionsCards})</span>
                                    </p>
                                </div>
                                {deck.orderedActionCards.map(id => (
                                        <CardDeckControl orientation="horizontal" key={id} cardId={id}/>
                                ))}
                            </Tab>
                        </div>

                        {deck.quantityMonumentsWeaponsCards > 0 &&
                                <Tab class="mt-2">
                                    <div q:slot="title">
                                        <p class="text-[1rem] font-bold">
                                            Monumentos y Armas <span
                                                class="text-green-400">({deck.quantityMonumentsWeaponsCards})</span>
                                        </p>
                                    </div>
                                    {deck.orderedMonumentWeaponCards.map(id => (
                                            <CardDeckControl orientation="horizontal" key={id} cardId={id}/>
                                    ))}
                                </Tab>
                        }

                        <div>
                            <Tab class="mt-2">
                                <div q:slot="title">
                                    <p class="text-[1rem] font-bold">
                                        Tesoros <span class="text-green-400">({deck.quantityInTreasureDeck}) </span>
                                        Puntos: <span class="text-blue-400">{deck.treasurePoints}</span></p>
                                </div>
                                {deck.orderedTreasureCards.map(id => (
                                        <CardDeckControl orientation="horizontal" key={id} cardId={id}/>
                                ))}
                            </Tab>
                        </div>

                        {deck.quantityInSideDeck > 0 &&
                                <Tab class="mt-2">
                                    <div q:slot="title">
                                        <p class="text-[1rem] font-bold">
                                            Side <span class="text-green-400">({deck.quantityInSideDeck})</span>
                                        </p>
                                    </div>
                                    {deck.orderedSideCards.map(id => (
                                            <CardDeckControl orientation="horizontal" isSide key={id} cardId={id}/>
                                    ))}
                                </Tab>
                        }
                    </>
            );
        });
