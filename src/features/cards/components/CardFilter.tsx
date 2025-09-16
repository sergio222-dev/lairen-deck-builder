import { $, component$, Signal, useComputed$, useContext, useSignal } from '@builder.io/qwik';
import { Accordion }                                                  from "~/components/accordion/Accordion";
import { Button, ButtonIcon }                                         from "~/components/button";
import { ChipFilter, FilterField }                                    from "~/components/filterField/FilterField";
import { Icon }                                                       from "~/components/icons/Icon";
import { CATEGORY_FILTERS }                                           from "~/UI/filters/models/filterDefinition.model";
import { FILTER_CONTEXT }                                             from "~/UI/filters/store/filter.store";
import { Pagination }                                                 from './Pagination';

interface CardFilterProps {
    mobileListDeckRef?: Signal<HTMLDivElement | undefined>;
}

export const CardFilter = component$<CardFilterProps>(({ mobileListDeckRef }) => {
    const refDialog = useSignal<HTMLDialogElement>();
    const f         = useContext(FILTER_CONTEXT);

    const handleDialogOpen = $(() => {
        refDialog.value?.showModal();
    })

    const handleDialogClose = $(() => {
        refDialog.value?.close();
    })

    const addContainsFilter = $(async (value: string) => {
        void f.addFilter(CATEGORY_FILTERS.TEXT, value);
    });

    const handleClearLastFilter = $(async () => {
        if (f.filterGroups[CATEGORY_FILTERS.TEXT].currentValues.length === 0) return;
        const lastFilter = f.filterGroups[CATEGORY_FILTERS.TEXT].currentValues[f.filterGroups[CATEGORY_FILTERS.TEXT].currentValues.length -
        1];
        void f.removeFilter(CATEGORY_FILTERS.TEXT, lastFilter.value);
    });

    const handleToggleFilter = $(async (id: CATEGORY_FILTERS, value: string, label?: string) => {
        if (f.filterGroups[id].currentValues.find(v => v.value === value)) {
            void f.removeFilter(id, value);
        } else {
            void f.addFilter(id, value, label);
        }
    })

    // TODO: Check computation cost
    const numberOfFilters = useComputed$(() => {
        return Object.values(f.filterGroups)
                .filter(ff => !(ff.id ===
                        CATEGORY_FILTERS.TEXT ||
                        ff.id ===
                        CATEGORY_FILTERS.SORT ||
                        ff.id ===
                        CATEGORY_FILTERS.PAGINATION))
                .reduce((a, v) => {
                    return a + v.currentValues.length;
                }, 0)
    })


    // Render
    return (
            <div>
                <div class="flex items-center w-full gap-2">
                    <FilterField
                            onSubmit={addContainsFilter}
                            onClear={handleClearLastFilter}
                    >
                        {f.filterGroups[CATEGORY_FILTERS.TEXT].currentValues.map((v) => (
                                <ChipFilter key={v.value} onClick$={() => f.removeFilter(CATEGORY_FILTERS.TEXT,
                                        v.value)}>{v.label}</ChipFilter>
                        ))}
                    </FilterField>
                    <Button onClick$={handleDialogOpen} class="px-2 py-3 flex items-baseline text-black gap-2 relative">
                        Filters
                        <Icon name="art" width={16} height={16} class="fill-primary"/>
                        <span
                                class="absolute top-[-0.25rem] right-[-0.25rem] text-xs text-white bg-primary ring-1 ring-black rounded-[50%] w-4 h-4 z-10">
            {numberOfFilters.value}
          </span>
                    </Button>
                </div>
                <dialog ref={refDialog} class="p-4 container max-w-xl">
                    <div class="flex gap-2">
                        <h2 class="text-xl flex-1">Filter</h2>
                        <div>
                            <ButtonIcon onClick$={handleDialogClose}>
                                <Icon name="close" width={32} height={32} class="fill-primary"/>
                            </ButtonIcon>
                        </div>
                    </div>
                    <div class="p-4">

                        <Accordion title={f.filterGroups[CATEGORY_FILTERS.SUPER_TYPE].label}
                                   quantity={f.quantitySuperTypeFilters}>
                            <div class="flex flex-wrap gap-2">
                                {f.filterGroups[CATEGORY_FILTERS.SUPER_TYPE].availableValues.map(v => (
                                        <button
                                                class={`hover:bg-primary hover:text-white ring-2 ring-primary cursor-pointer px-2 py-1
                        ${(f.superTypeFilters.includes(v.value)) ? 'bg-primary text-white' : ''}`}
                                                key={v.value}
                                                onClick$={() => handleToggleFilter(CATEGORY_FILTERS.SUPER_TYPE,
                                                        v.value,
                                                        v.label)}
                                        >
                                            {v.label}
                                        </button>
                                ))}
                            </div>
                        </Accordion>

                        <Accordion title={f.filterGroups[CATEGORY_FILTERS.TYPE].label} quantity={f.quantityTypeFilters}>
                            <div class="flex flex-wrap gap-2">
                                {f.filterGroups[CATEGORY_FILTERS.TYPE].availableValues.map(v => (
                                        <button
                                                class={`hover:bg-primary hover:text-white ring-2 ring-primary cursor-pointer px-2 py-1
                        ${(f.typeFilters.includes(v.value)) ? 'bg-primary text-white' : ''}`}
                                                key={v.value}
                                                onClick$={() => handleToggleFilter(CATEGORY_FILTERS.TYPE,
                                                        v.value,
                                                        v.label)}
                                        >
                                            {v.label}
                                        </button>
                                ))}
                            </div>
                        </Accordion>

                        <Accordion
                                title={f.filterGroups[CATEGORY_FILTERS.SUB_TYPE].label}
                                isExclusive={f.filterGroups[CATEGORY_FILTERS.SUB_TYPE].exclusive}
                                onExclusive={$(() => f.toggleExclusive(CATEGORY_FILTERS.SUB_TYPE))}
                                quantity={f.quantitySubTypeFilters}
                        >
                            <div class="flex flex-wrap gap-2">
                                {f.filterGroups[CATEGORY_FILTERS.SUB_TYPE].availableValues.map(v => (
                                        <button
                                                class={`hover:bg-primary hover:text-white ring-2 ring-primary cursor-pointer px-2 py-1
                        ${(f.subTypeFilters.includes(v.value)) ? 'bg-primary text-white' : ''}`}
                                                key={v.value}
                                                onClick$={() => handleToggleFilter(CATEGORY_FILTERS.SUB_TYPE,
                                                        v.value,
                                                        v.label)}
                                        >
                                            {v.label}
                                        </button>
                                ))}
                            </div>
                        </Accordion>
                        <Accordion title={f.filterGroups[CATEGORY_FILTERS.SET].label} quantity={f.quantitySetFilters}>
                            <div class="flex flex-wrap gap-2">
                                {f.filterGroups[CATEGORY_FILTERS.SET].availableValues.map(v => (
                                        <button
                                                class={`hover:bg-primary hover:text-white ring-2 ring-primary cursor-pointer px-2 py-1
                        ${(f.setFilters.includes(v.value)) ? 'bg-primary text-white' : ''}`}
                                                key={v.value}
                                                onClick$={() => handleToggleFilter(CATEGORY_FILTERS.SET,
                                                        v.value,
                                                        v.label)}
                                        >
                                            {v.label}
                                        </button>
                                ))}
                            </div>
                        </Accordion>
                        <Accordion title={f.filterGroups[CATEGORY_FILTERS.RARITY].label}
                                   quantity={f.quantityRarityFilters}>
                            <div class="flex flex-wrap gap-2">
                                {f.filterGroups[CATEGORY_FILTERS.RARITY].availableValues.map((v) => (
                                        <button
                                                class={`hover:bg-primary hover:text-white ring-2 ring-primary cursor-pointer px-2 py-1
                  ${f.rarityFilters.includes(v.value) ? 'bg-primary text-white' : ''}`}
                                                key={v.label}
                                                onClick$={() => handleToggleFilter(CATEGORY_FILTERS.RARITY,
                                                        v.value,
                                                        v.label)}
                                        >
                                            {v.label}
                                        </button>
                                ))}
                            </div>
                        </Accordion>
                    </div>
                </dialog>
                <Pagination mobileListDeckRef={mobileListDeckRef}/>
            </div>
    );
});
