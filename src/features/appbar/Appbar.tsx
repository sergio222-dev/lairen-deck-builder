import { component$, useContext, useSignal, useTask$ } from '@builder.io/qwik';
import { Link, useLocation }                           from '@builder.io/qwik-city';
import { Icon }                              from "~/components/icons/Icon";
import { UserContext }                       from "~/routes/layout";
import { AppContext }                        from "~/stores/appContext";

export const Appbar = component$(() => {
  const location   = useLocation();
  const isMenuOpen = useSignal(false);

  const user = useContext(UserContext);
  const app  = useContext(AppContext);

  useTask$(async ({ track }) => {
    track(() => location.isNavigating);

    app.isLoading = location.isNavigating;
  });

  return (
    <>
      <header class="w-full p-4 bg-primary text-white">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center">
            <Link onClick$={() => isMenuOpen.value = false} rel="noopener noreferrer" href="/"
                  aria-label="Back to homepage" class="flex items-center p-2">
              <h2 class="font-bold text-2xl">LDB</h2>
            </Link>
          </div>
          <div class="sm:hidden cursor-pointer" onClick$={() => isMenuOpen.value = !isMenuOpen.value}>
            <Icon name="menu" width={24} height={24} class="fill-secondary"/>
          </div>
          <div class="hidden sm:flex">
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
        <div hidden={!isMenuOpen.value} class="container mx-auto sm:hidden">
          <ul class="items-stretch space-y-3">
            <li class="flex">
              <Link onClick$={() => isMenuOpen.value = false} rel="noopener noreferrer" href="/cards"
                    class="flex items-center px-2 ">Cards</Link>
            </li>
            <li class="flex">
              <Link onClick$={() => isMenuOpen.value = false} rel="noopener noreferrer" href="/decks"
                    class="flex items-center px-2 ">Decks</Link>
            </li>
            {user.value && (<li class="flex">
                <Link onClick$={() => isMenuOpen.value = false} rel="noopener noreferrer" href="/mydecks"
                      class="flex items-center px-2 ">My decks</Link>
              </li>
            )}
          </ul>
        </div>
      </header>
      <div class={`fixed top-0 left-0 h-1 w-full ${app.isLoading ? ` bg-secondary animate-pulse` : ''}`}></div>
    </>
  );
});
