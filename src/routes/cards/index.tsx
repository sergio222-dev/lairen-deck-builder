import { component$, useContextProvider } from '@builder.io/qwik';
import { Card }                           from '~/features/cards';
import { useInitialFilterStoreLoader }    from "~/providers/loaders/useInitialFilterStoreLoader";
import { FILTER_CONTEXT, useFilterStore } from "~/UI/filters/store/filter.store";

export { useInitialFilterStoreLoader }

export default component$(() => {
    const filterState = useInitialFilterStoreLoader();

    const filterData = useFilterStore(filterState);

    useContextProvider(FILTER_CONTEXT, filterData);

    return (
            <Card/>
    );
});
