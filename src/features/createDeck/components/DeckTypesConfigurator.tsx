import { $, component$, useContext, useSignal, useTask$ } from "@builder.io/qwik";
import { Menu } from "~/components/menu";
import { DeckCreationContext } from "~/stores/deckCreationContext";

export const DeckTypesConfigurator = component$(() => {
    const deckStore = useContext(DeckCreationContext);

    const type1 = useSignal<string | null>(null);
    const type2 = useSignal<string | null>(null);

    // Fetch deck types using the loader
    // const types = useUnitTypeLoader();
    const deckTypes = useSignal<string[]>([]);

    useTask$(() => {
        deckTypes.value = deckStore.types.value;
    });

    const handleTypeChange = $((type: "subType1" | "subType2", value: string | null) => {
        if (type === "subType1") {
            deckStore.subType1 = value;
        } else {
            deckStore.subType2 = value;
        }

        void deckStore.validateDeck();
    });

    return (
        <div class="flex items-center gap-2">
            <Menu>
                <div q:slot="label">Deck Types</div>
                <div class="flex gap-2 text-black">
                    {/* Dropdown for the first type */}
                    <select
                        value={type1.value || ""}
                        onChange$={(e) => handleTypeChange("subType1", (e.target as HTMLSelectElement).value || null)}
                        class="w-full rounded-lg border-2 border-gray-300 bg-white p-3 text-sm shadow-sm transition focus:outline-none focus:ring-secondary focus:ring-2"
                    >
                        <option value="" class="text-gray-400">
                            Type 1
                        </option>
                        {deckTypes.value.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>

                    {/* Dropdown for the second type */}
                    <select
                        value={type2.value || ""}
                        onChange$={(e) => handleTypeChange("subType2", (e.target as HTMLSelectElement).value || null)}
                        class="w-full rounded-lg border-2 border-gray-300 bg-white p-3 text-sm shadow-sm transition focus:outline-none focus:ring-secondary focus:ring-2"
                    >
                        <option value="" class="text-gray-400">
                            Type 2
                        </option>
                        {deckTypes.value.map((type) => (
                            <option key={type} value={type}>
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
