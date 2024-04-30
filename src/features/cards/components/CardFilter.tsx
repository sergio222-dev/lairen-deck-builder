import { $, component$, useContext, useStore, useTask$ }            from '@builder.io/qwik';
import { Menu }                                                     from '~/components/menu';
import { MenuTw }                                                   from '~/components/menuTw/MenuTw';
import { MenuTwItem }                                               from '~/components/menuTw/MenuTwItem';
import { cardFilter, sortDirection }                                from '~/config/cardFilter';
import { useSubtypeLoader }                                         from '~/routes/cards';
import type { CardFilters}                                          from '~/stores/filterContext';
import { FilterContext }                                            from '~/stores/filterContext';
import { useDebounce }                                              from '~/utils/useDebounce';
import { Pagination }                                               from './Pagination';

export const CardFilter = component$(() => {
    const c = useContext(FilterContext);
    // const subtypesFilter = useSignal<string[]>([]);

    const filters = useStore<CardFilters>({
        sortBy: 'name',
        sortDirection: 'asc',
        name: '',
        types: []
    })

    useTask$(({track}) => {
        track(() => filters.sortBy);
        track(() => filters.sortDirection);
        track(() => filters.name);
        track(() => filters.types);

        c.updateFilters(filters);
    })


    const subtypes = useSubtypeLoader();

    const debounceUpdateName = useDebounce(1000, $((event: Event) => {
        const value = (event.target as HTMLInputElement).value;

        void c.updateName(value);
    }));




    return (
        <div class="flex justify-between">
            <form
                preventdefault:submit
            >
                <Menu
                onChange$={(e) => filters.sortBy = (e.target as HTMLInputElement).value}
                    name="sortBy">
                    {cardFilter.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </Menu>

                <Menu
                    onChange$={(e) => { console.log('chged'); filters.sortDirection = (e.target as HTMLInputElement).value as 'asc' | 'desc'}}
                    name="sortDirection">
                    {sortDirection.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </Menu>

                {/*<Menu*/}
                {/*  name="subtype"*/}
                {/*>*/}
                {/*    {subtypes.value.map(s => (*/}
                {/*      <option key={s} value={s}>{s}</option>*/}
                {/*    ))}*/}
                {/*</Menu>*/}

                <MenuTw
                onChange={$((s) => { filters.types = s })}
                    // form={el.value} onChange={$((s) => { subtypesFilter.value = s })}
                >
                    {subtypes.value.map(s => (
                        <MenuTwItem key={s} label={s} value={s} />
                    ))}
                </MenuTw>

                <input name="name" onInput$={e => {
                    void debounceUpdateName(e);
                }} type="text" placeholder="Name" />
            </form>
            <Pagination />
        </div>
    );
});
