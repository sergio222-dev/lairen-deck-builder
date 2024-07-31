import type { ButtonHTMLAttributes } from "@builder.io/qwik";
import { Slot }                      from "@builder.io/qwik";
import { component$ }                from "@builder.io/qwik";
import { Button }                    from "~/components/button/Button";

interface ButtonIconProps extends ButtonHTMLAttributes<HTMLButtonElement> {

}

export const ButtonIcon = component$<ButtonIconProps>(({ class: className, ...props }) => {
  return (
    <Button class={`border-black border-2 rounded-full p-0 ${className}`} {...props} >
      <Slot/>
    </Button>
  )
});
