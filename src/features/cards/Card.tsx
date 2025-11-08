import { component$ } from '@builder.io/qwik';
import { CardFilter } from './components/CardFilter';
import { CardList }   from './components/CardList';

export const Card = component$(() => {

    return (
            <div class="flex flex-col h-full w-full">
                <div class="p-2">
                    <CardFilter/>
                </div>
                <div class="flex-1 overflow-y-auto">
                    <CardList/>
                </div>
            </div>
    );
});
