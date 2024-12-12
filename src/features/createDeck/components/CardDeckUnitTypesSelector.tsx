import { component$ } from "@builder.io/qwik";

export const CardDeckUnitTypesSelector = component$(() => {
  return (
    <div class="flex flex-col gap-2">
      <div class="flex gap-2">
        <div class="flex-1">
          <label for="card-subtype-selector" class="text-white">Unit Type</label>
        </div>
        <div class="flex-1">
          <select id="card-subtype-selector" class="bg-gray-800 text-white">
            <option value="0">Select a Unit Type</option>
          </select>
        </div>
      </div>
    </div>
  );
});
