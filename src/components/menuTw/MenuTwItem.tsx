import { component$, useComputed$, useContext } from '@builder.io/qwik';
import { SelectContext }                        from '~/components/menuTw/MenuTw';

interface MenuTwItemProps {
    label: string;
    value: string;
}

export const MenuTwItem = component$<MenuTwItemProps>((props) => {

    const selected = useContext(SelectContext)
    const isSelected = useComputed$(() => selected.value.includes(props.value));

    return (
        <div
        role="option"
        aria-selected={isSelected.value}
            onClick$={() => isSelected.value ? selected.value = selected.value.filter((value) => value !== props.value) : selected.value = [...selected.value, props.value]}
            class="cursor-pointer w-full border-gray-100 rounded-t border-b hover:bg-teal-100"
        >
            <div class={`flex w-full items-center p-2 pl-2 border-transparent border-l-4 relative ${isSelected.value ? 'border-teal-600' : 'hover:border-teal-100'}`}>
                <div class="w-full items-center flex">
                    <div class="mx-2 leading-6  ">{props.value}</div>
                </div>
            </div>
        </div>
    );
})
