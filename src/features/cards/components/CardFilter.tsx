import { $, component$, useContext, useStore, useTask$ } from '@builder.io/qwik';
import { Menu }                                          from '~/components/menu';
import { MenuTw }                                        from '~/components/menuTw/MenuTw';
import { MenuTwItem }                                    from '~/components/menuTw/MenuTwItem';
import { cardFilter, sortDirection }                     from '~/config/cardFilter';
import { useSubtypeLoader }                              from '~/routes/cards';
import type { CardFilters }                              from '~/stores/filterContext';
import { FilterContext }                                 from '~/stores/filterContext';
import { getDefaultFilter }                              from '~/utils/cardFilters';
import { useDebounce }                                   from '~/utils/useDebounce';
import { Pagination }                                    from './Pagination';

export const CardFilter = component$(() => {
  // Loaders
  const subtypes = useSubtypeLoader();

  // Context
  const c = useContext(FilterContext);

  // State
  const filters = useStore<CardFilters>(getDefaultFilter(1));

  // Side effects
  useTask$(({ track }) => {
    track(() => filters.sortBy);
    track(() => filters.sortDirection);
    track(() => filters.name);
    track(() => filters.types);

    void c.updateFilters(filters);
  });

  // Handlers
  const debounceUpdateName = useDebounce(250, $((event: Event) => {
    const value = (event.target as HTMLInputElement).value;

    void c.updateName(value);
  }));

  // Render
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
          onChange$={(e) => {
            filters.sortDirection = (e.target as HTMLInputElement).value as 'asc' | 'desc';
          }}
          name="sortDirection">
          {sortDirection.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </Menu>

        <MenuTw
          onChange={$((s) => {
            filters.types = s;
          })}
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
