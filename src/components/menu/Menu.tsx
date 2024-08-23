import type { QRL }           from '@builder.io/qwik';
import { $, Slot, useSignal } from '@builder.io/qwik';
import { component$ }         from '@builder.io/qwik';
import { Icon }               from "~/components/icons/Icon";

interface MenuProps {
  onClick?: QRL<() => void>;
  right?: boolean;
}

export const Menu = component$<MenuProps>(({ onClick, right }) => {
  const isOpen = useSignal(false);

  const handleToggle = $(() => {
    isOpen.value = !isOpen.value;
    onClick?.();
  })

  return (
    <div class="relative inline-block">
      <button onClick$={handleToggle} class={`px-4 py-2 bg-secondary rounded flex gap-2 items-center`}>
        <Slot name="label"/>
        {isOpen.value
          ? <Icon name="up" width={12} height={12} class="fill-primary"/>
          : <Icon name="down" width={12} height={12} class="fill-primary"/>
        }
      </button>
      <div
        class="absolute ring-2 ring-primary mx-0.5 p-2 mt-0.5 rounded min-w-max w-full bg-primary text-white"
        style={{ display: isOpen.value ? 'block' : 'none', ...(right ? { right: 0} : {}) }}>
        <Slot/>
      </div>
    </div>
  );
});
