import { $, component$, Slot, useContextProvider, useStore } from '@builder.io/qwik';
import { serverCard }                                        from '~/features/cards/server/fetchCards';
import type { FilterContextState }                           from '~/stores/filterContext';
import { FilterContext }                                     from '~/stores/filterContext';

export default component$(() => {

    const storeCards = useStore<FilterContextState>({
        cards                       : [],
        count                       : 0,
        sortBy                      : 'name',
        sortDirection               : 'asc',
        name                        : '',
        page                        : 1,
        size                        : 20,
        updateName: $(async function (this, name) {
            this.name               = name;
            const payload = {
                page                : this.page,
                size                : this.size,
                sortBy              : this.sortBy,
                sortDirection       : this.sortDirection,
                name
            };

            const { cards, count } = await serverCard(payload);

            console.log(cards, count);

            this.cards              = cards;
            this.count              = count;
        }),
        setPage: $(async function (this, page) {
            this.page               = page;
            const payload = {
                page,
                size                : this.size,
                sortBy              : this.sortBy,
                sortDirection       : this.sortDirection,
                name                : this.name
            };

            const { cards, count } = await serverCard(payload);

            this.cards              = cards;
            this.count              = count;
        }),
        setSize: $(async function (this, size) {
            this.size               = size;
            const payload = {
                page                : this.page,
                size,
                sortBy              : this.sortBy,
                sortDirection       : this.sortDirection,
                name                : this.name
            };

            const {  cards, count } = await serverCard(payload);

            this.cards              = cards;
            this.count              = count;
        }),
        updateFilters: $(async function (this, cardListFilter) {
            this.sortBy             = cardListFilter.sortBy;
            this.sortDirection      = cardListFilter.sortDirection;
            this.name               = cardListFilter.name;

            const payload = {
                ...cardListFilter,
                page                : this.page,
                size                : this.size
            };


            const { cards, count }  = await serverCard(payload)

            this.cards              = cards;
            this.count              = count;
        })
    });

    useContextProvider<FilterContextState>(FilterContext, storeCards);

    return (
        <>
            <Slot />
        </>
    );
});
