import type { QRL }      from '@builder.io/qwik';
import { $, component$ } from '@builder.io/qwik';

interface SwitchProps {
  name: string
  value: boolean
  id?: string
  onChange?: QRL<(value: boolean) => void>
}

export const Switch = component$<SwitchProps>(({ name, value, id, onChange }) => {

  const handleChange = $<(e: Event) => void>(() => {
    onChange?.(!value);
  })

  return (
    <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
      <input preventdefault:click onClick$={handleChange} {...id ? { id } : {}} checked={value} type="checkbox"
             name={name}
             class="absolute block w-6 h-6 checked:right-0 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
      <label {...id ? { for: id } : {}}
             class={`block overflow-hidden h-6 rounded-full  cursor-pointer ${value ?
               'bg-green-700' :
               'bg-gray-300'}`}></label>
    </div>
  );
});
