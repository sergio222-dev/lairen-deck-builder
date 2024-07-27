import type { Signal } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";

interface PopoverCardProps {
  ref?: Signal<HTMLDivElement | undefined>;
  show: boolean;
  image: string;
}

export const PopoverCard = component$<PopoverCardProps>(({ref, show, image}) => {

  return (
    <div
      ref={ref}
      class={`z-10 aspect-[3/4] w-[400px] bg-no-repeat bg-[length:100%_100%] border-secondary border-2 m-0 fixed ${show ?
        '' :
        'hidden'} top-0 left-0`}
      style={{ backgroundImage: `url(${image})` }}>
    </div>  )
});
