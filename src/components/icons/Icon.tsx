import type { JSXOutput, SVGProps } from "@builder.io/qwik";
import { component$ }               from "@builder.io/qwik";

const ICONS: Record<IconName, (props: SVGProps<SVGElement>) => JSXOutput> = {
  'art':   (props: SVGProps<SVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 512 512">
      <path
        d="M0 64C0 28.7 28.7 0 64 0L352 0c35.3 0 64 28.7 64 64l0 64c0 35.3-28.7 64-64 64L64 192c-35.3 0-64-28.7-64-64L0 64zM160 352c0-17.7 14.3-32 32-32l0-16c0-44.2 35.8-80 80-80l144 0c17.7 0 32-14.3 32-32l0-32 0-90.5c37.3 13.2 64 48.7 64 90.5l0 32c0 53-43 96-96 96l-144 0c-8.8 0-16 7.2-16 16l0 16c17.7 0 32 14.3 32 32l0 128c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32l0-128z"/>
    </svg>),
  'close': (props: SVGProps<SVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 384 512">
      <path
        d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
    </svg>
  ),
  'menu':  (props: SVGProps<SVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
      <path
        d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/>
    </svg>
  )
}

type IconName = 'art' | 'close' | 'menu';

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
