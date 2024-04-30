import { $, component$, useContext } from '@builder.io/qwik';
import { Menu }                      from '~/components/menu';
import { cardFilter, sortDirection } from '~/config/cardFilter';
import { FilterContext }             from '~/stores/filterContext';
import { useDebounce }               from '~/utils/useDebounce';
import { Pagination }                from './Pagination';

export const CardFilter = component$(() => {
    const c = useContext(FilterContext);

    const debounceUpdateName = useDebounce(1000, $((event: Event) => {
        const value = (event.target as HTMLInputElement).value;

        void c.updateName(value);
    }));

    return (
        <div class="flex justify-between">
            <form onChange$={(e) => {
                if ((e.target as HTMLInputElement).name === 'name') return;

                // get form data from form and updateFilters
                const formData = new FormData((e.target as HTMLFormElement).form);

                void c.updateFilters({
                    sortBy: formData.get('sortBy') as string,
                    sortDirection: formData.get('sortDirection') as 'asc' | 'desc',
                    name: formData.get('name') as string
                });
            }}>
                <Menu
                    name="sortBy">
                    {cardFilter.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </Menu>

                <Menu
                    name="sortDirection">
                    {sortDirection.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </Menu>

                <input name="name" onInput$={e => {
                    void debounceUpdateName(e);
                }} type="text" placeholder="Name" />
            </form>
            <Pagination />
        </div>
    );
});
