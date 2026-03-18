import { $, component$, useContext } from "@builder.io/qwik";
import { Menu }                      from "~/components/menu";
import { DECK_CREATION_CONTEXT }     from "~/UI/deck/store/deckCreation.store";

export const DeckTypesConfigurator = component$(() => {
    const deckStore = useContext(DECK_CREATION_CONTEXT);

    const handleTypeChange = $((type: "subType1" | "subType2", value: string | null) => {
        if (type === "subType1") {
            deckStore.type1 = value;
        } else {
            deckStore.type2 = value;
        }

    });

    return (
            <div class="flex items-center gap-2">
                <Menu>
                    <div q:slot="label">Tipos del Mazo</div>
                    <div class="flex gap-3 text-black">
                        {/* Dropdown for the first type */}
                        <select
                                onChange$={(e) => handleTypeChange("subType1",
                                        (e.target as HTMLSelectElement).value || null)}
                                class="w-full rounded-lg bg-white p-2 text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-secondary"
                        >
                            <option value="" class="text-gray-400">
                                Seleccione tipo 1
                            </option>
                            {deckStore.types.map((type) => (
                                    <option selected={deckStore.type1 === type} key={type} value={type}>
                                        {type}
                                    </option>
                            ))}
                        </select>

                        {/* Dropdown for the second type */}
                        <select
                                onChange$={(e) => handleTypeChange("subType2",
                                        (e.target as HTMLSelectElement).value || null)}
                                class="w-full rounded-lg bg-white p-2 text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-secondary"
                        >
                            <option value="" class="text-gray-400">
                                Seleccione tipo 2
                            </option>
                            {deckStore.types.map((type) => (
                                    <option selected={deckStore.type2 === type} key={type} value={type}>
                                        {type}
                                    </option>
                            ))}
                        </select>
                    </div>
                </Menu>
            </div>
    );
});
