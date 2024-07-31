import { component$ }          from "@builder.io/qwik";
import { Link }                from "@builder.io/qwik-city";
import { createClientBrowser } from "~/lib/supabase-qwik";

interface DeckCardProps {
  id: number;
  splashArt?: string;
  name: string;
  path?: string;
}

export const DeckCard = component$<DeckCardProps>(({ id, splashArt, name, path = '/decks/preview' }) => {
  const supabase = createClientBrowser();

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
            backgroundImage: `radial-gradient(transparent, rgb(0, 0, 0)), url(${supabase.storage.from(
              'CardImages/cards').getPublicUrl(splashArt + '.webp').data.publicUrl})`
          }
        } : {})}
      >
        <div class="font-bold">
          {name}
        </div>
        <div class="hidden mt-auto justify-between">
          <p>
            {/*{d.description}*/}
          </p>
        </div>
      </div>
    </Link>
  );
});
