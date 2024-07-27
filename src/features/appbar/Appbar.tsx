import { component$, useContext } from '@builder.io/qwik';
import { Link, useLocation }      from '@builder.io/qwik-city';
import { UserContext }            from "~/routes/layout";

export const Appbar = component$(() => {
  const location = useLocation();

  const user = useContext(UserContext);
  console.log('rendered');

  return (
    <>
      <header class="p-4 bg-primary text-white">
        <div class="container mx-auto w-full flex justify-between h-16">
          <div class="flex items-center">
            <Link rel="noopener noreferrer" href="/" aria-label="Back to homepage" class="flex items-center p-2">
              <h2 class="font-bold text-2xl">LDB</h2>
            </Link>
          </div>
          <div class="flex">
            <ul class="items-stretch space-x-3 flex">
              <li class="flex">
                <Link rel="noopener noreferrer" href="/cards"
                      class="flex items-center px-4 ">Cards</Link>
              </li>
              <li class="flex">
                <Link rel="noopener noreferrer" href="/decks"
                      class="flex items-center px-4 ">Decks</Link>
              </li>
              {user.value && (<li class="flex">
                  <Link rel="noopener noreferrer" href="/mydecks"
                        class="flex items-center px-4 ">My decks</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </header>
      <div class={`h-1 w-full ${location.isNavigating ? ` bg-secondary animate-pulse` : ''}`}></div>
    </>
  );
});
