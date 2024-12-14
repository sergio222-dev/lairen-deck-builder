import { $, component$, useContext } from "@builder.io/qwik";
import { Menu } from "~/components/menu";
import { DeckCreationContext } from "~/stores/deckCreationContext";

export const DeckTypesConfigurator = component$(() => {
    const deckStore = useContext(DeckCreationContext);

    const handleTypeChange = $((type: "subType1" | "subType2", value: string | null) => {
        if (type === "subType1") {
            deckStore.deckData.subType1 = value;
        } else {
            deckStore.deckData.subType2 = value;
        }

        void deckStore.validateDeck();
    });

    return (
        <div class="flex items-center gap-2">
            <Menu>
                <div q:slot="label">Deck Types</div>
                <div class="flex gap-3 text-black">
                    {/* Dropdown for the first type */}
                    <select
                        onChange$={(e) => handleTypeChange("subType1", (e.target as HTMLSelectElement).value || null)}
                        class="w-full rounded-lg bg-white p-2 text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-secondary"
                    >
                        <option value="" class="text-gray-400">
                            Type 1
                        </option>
                        {deckStore.types.value.map((type) => (
                            <option selected={deckStore.deckData.subType1 === type} key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>

                    {/* Dropdown for the second type */}
                    <select
                        onChange$={(e) => handleTypeChange("subType2", (e.target as HTMLSelectElement).value || null)}
                        class="w-full rounded-lg bg-white p-2 text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-secondary"
                    >
                        <option value="" class="text-gray-400">
                            Type 2
                        </option>
                        {deckStore.types.value.map((type) => (
                            <option selected={deckStore.deckData.subType2 === type} key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
            </Menu>
            {/* Validation Status */}
            <div>
                {deckStore.isDeckIgnored ? (
                    <span class="text-yellow-500">⚠ Deck is ignored</span>
                ) : deckStore.isDeckValid ? (
                    <span class="text-green-500">✔ Deck is valid</span>
                ) : (
                    <span class="text-red-500">✖ Invalid deck</span>
                )}
            </div>
        </div>
    );
});
