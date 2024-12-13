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

        console.log(deckStore.subType1, deckStore.subType2);

        void deckStore.validateDeck();
    });

    return (
        <Menu>
            <div q:slot="label">Deck Types</div>
            <div class="flex gap-2 text-black">
                {/* Dropdown for the first type */}
                <select
                    value={type1.value || ""}
                    onChange$={(e) => handleTypeChange("subType1", (e.target as HTMLSelectElement).value || null)}
                    class="rounded border p-2"
                >
                    <option value="">Select Type 1</option>
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
                    class="rounded border p-2"
                >
                    <option value="">Select Type 2</option>
                    {deckTypes.value.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>

            {/* Validation Status */}
            <div class="mt-4">
                {deckStore.isDeckIgnored ? (
                        <span class="text-yellow-500">⚠ Deck is ignored</span>
                ) : deckStore.isDeckValid ? (
                        <span class="text-green-500">✔ Deck is valid</span>
                ) : (
                        <span class="text-red-500">✖ Invalid deck</span>
                )}
            </div>
        </Menu>
    );
});
