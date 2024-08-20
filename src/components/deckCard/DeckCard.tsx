import { component$ }          from "@builder.io/qwik";
import { Link }                from "@builder.io/qwik-city";
import { Icon }                from "~/components/icons/Icon";

interface DeckCardProps {
  id: number;
  splashArt?: string;
  name: string;
  path?: string;
  likes?: number;
}

export const DeckCard = component$<DeckCardProps>(({ id, splashArt, likes = 0, name, path = '/decks/preview' }) => {

  return (
    <Link
      href={`${path}/${id}`}
      class="aspect-[4/3] w-[100%] 2xl:w-[calc(20%-0.5rem)] xl:w-[calc(25%-0.5rem)] lg:w-[calc(25%-0.5rem)] md:w-[calc(33%-0.5rem)] sm:w-[calc(50%-0.5rem)]"
    >
      <div
        class={`aspect-[4/3] bg-[radial-gradient(transparent,#000000)] shadow hover:shadow-[0_0_4px_0]
              hover:shadow-primary border-2 border-secondary hover:border-primary rounded-[24px] cursor-pointer 
              bg-no-repeat bg-[length:160%_auto] bg-[50%_30%] relative flex flex-col items-center text-white
              p-4
              `}
        {...(splashArt ? {
          style: {
            backgroundImage: `radial-gradient(transparent, rgb(0, 0, 0)), url(${splashArt}`
          }
        } : {})}
      >
        <div class="max-w-[100%]">
          <p class="font-bold text-[1.5rem] sm:text-[1.5rem] md:text-[1rem] whitespace-nowrap overflow-hidden overflow-ellipsis">{name}</p>
        </div>
        <div class="mt-auto justify-between text-white  w-full">
          <div class="flex items-center gap-2 justify-end">
            <Icon class="cursor-pointer fill-white" name="heart" width={16} height={16} /> {likes}
          </div>
        </div>
      </div>
    </Link>
  );
});
