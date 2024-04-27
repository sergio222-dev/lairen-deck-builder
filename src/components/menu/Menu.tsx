import type { SelectHTMLAttributes} from '@builder.io/qwik';
import { Slot } from '@builder.io/qwik';
import { component$ }           from '@builder.io/qwik';


interface MenuProps extends SelectHTMLAttributes<HTMLSelectElement> {
}

export const Menu = component$<MenuProps>((props) => {

  return (
    <select {...props}>
      <Slot />
    </select>
  );
});
