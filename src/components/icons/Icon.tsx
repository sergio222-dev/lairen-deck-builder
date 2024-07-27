import type { JSXOutput, SVGProps } from "@builder.io/qwik";
import { component$ }               from "@builder.io/qwik";

const ICONS: Record<IconName, (props: SVGProps<SVGElement>) => JSXOutput> = {
  'art': (props: SVGProps<SVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 512 512">
      <path
        d="M0 64C0 28.7 28.7 0 64 0L352 0c35.3 0 64 28.7 64 64l0 64c0 35.3-28.7 64-64 64L64 192c-35.3 0-64-28.7-64-64L0 64zM160 352c0-17.7 14.3-32 32-32l0-16c0-44.2 35.8-80 80-80l144 0c17.7 0 32-14.3 32-32l0-32 0-90.5c37.3 13.2 64 48.7 64 90.5l0 32c0 53-43 96-96 96l-144 0c-8.8 0-16 7.2-16 16l0 16c17.7 0 32 14.3 32 32l0 128c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32l0-128z"/>
    </svg>)
}

type IconName = 'art';

interface IconProps extends SVGProps<SVGElement> {
  name: IconName;
}

export const Icon = component$<IconProps>((props) => {
  return (
    <>
      {ICONS[props.name]({
        ...props
      })}
    </>
  )
});