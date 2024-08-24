import { component$, useContext, useSignal, useTask$ } from '@builder.io/qwik';
import { Link, useLocation }                           from '@builder.io/qwik-city';
import { useLogin, useLogout }                         from "~/actions/user";
import { Avatar }                                      from "~/components/avatar/Avatar";
import { GithubLink }                                  from "~/components/github/GithubLink";
import { Icon }                                        from "~/components/icons/Icon";
import { createClientBrowser }                         from "~/lib/supabase-qwik";
import { UserContext }                                 from "~/routes/layout";
import { AppContext }                                  from "~/stores/appContext";

export const Appbar = component$(() => {
  const location   = useLocation();
  const logout     = useLogout();
  const login      = useLogin();
  const isMenuOpen = useSignal(false);

  const user = useContext(UserContext);
  const app  = useContext(AppContext);

  useTask$(async ({ track }) => {
    track(() => location.isNavigating);

    app.isLoading = location.isNavigating;
  });

  return (
    <>
      <header class="w-full pt-5 pb-2 px-4 bg-primary text-white relative">
        <div class="absolute top-0 right-0">
          <GithubLink />
        </div>
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center">
            <Link onClick$={() => isMenuOpen.value = false} rel="noopener noreferrer" href="/"
                  aria-label="Back to homepage" class="flex items-center p-2">
              <h2 class="font-bold text-2xl">LDB</h2>
            </Link>
          </div>
          <div class="sm:hidden flex items-center gap-4">
            {user.value &&
              <Avatar image={user.value?.user_metadata.avatar_url}/>
            }
          <div class="sm:hidden cursor-pointer" onClick$={() => isMenuOpen.value = !isMenuOpen.value}>
            <Icon name="menu" width={24} height={24} class="fill-secondary"/>
          </div>
          </div>
          <div class="hidden sm:flex space-x-3">
            <ul class="items-stretch space-x-3 flex">
              <li class="flex">
                <Link rel="noopener noreferrer" href="/cards"
                      class="flex items-center px-4 ">Cards</Link>
              </li>
              <li class="flex">
                <Link rel="noopener noreferrer" href="/decks"
                      class="flex items-center px-4 ">Decks</Link>
              </li>
              {!user.value &&
                (<>
                    <li class="flex cursor-pointer">
                      <span class="flex items-center gap-2" onClick$={async () => {
                        const data = await login.submit();

                        // redirect
                        if (data.value.url) window.location.href = data.value.url;
                      }}>Login with
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 488 512"
                                      width={24}
                                      fill="white"
                                    >
                <path
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
              </svg>
                      </span>
                    </li>
                  </>
                )}
              {user.value &&
                (<>
                    <li class="flex">
                      <Link rel="noopener noreferrer" href="/mydecks"
                            class="flex items-center px-4 ">My decks</Link>
                    </li>
                    <li class="flex">
                      <Link rel="noopener noreferrer" href="#"
                            class="flex items-center px-4 ">Collection</Link>
                    </li>
                    <li class="flex cursor-pointer">
                      <span onClick$={async () => {
                        const supabaseClient = createClientBrowser();
                        await supabaseClient.auth.signOut();

                        void logout.submit();

                      }}
                            class="flex items-center px-4 ">Logout</span>
                    </li>
                  </>
                )}
            </ul>
            {user.value &&
              <Avatar image={user.value?.user_metadata.avatar_url}/>
            }
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
            {!user.value &&
              (<>
                  <li class="flex">
                      <span class="flex items-center gap-2 px-2 cursor-pointer" onClick$={async () => {
                        const data = await login.submit();

                        // redirect
                        if (data.value.url) window.location.href = data.value.url;
                      }}>Login with
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 488 512"
                                      width={24}
                                      fill="white"
                                    >
                <path
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
              </svg>
                      </span>
                  </li>
                </>
              )}
            {user.value && (
              <>
                <li class="flex">
                  <Link onClick$={() => isMenuOpen.value = false} rel="noopener noreferrer" href="/mydecks"
                        class="flex items-center px-2 ">My decks</Link>
                </li>
                <li class="flex">
                  <Link onClick$={() => isMenuOpen.value = false} rel="noopener noreferrer" href="#"
                        class="flex items-center px-2 ">Collection</Link>
                </li>
                <li class="flex">
                      <span onClick$={async () => {
                        const supabaseClient = createClientBrowser();
                        await supabaseClient.auth.signOut();

                        void logout.submit();

                      }}
                            class="flex items-center px-2 cursor-pointer">Logout</span>
                </li>
              </>
            )}
          </ul>
        </div>
      </header>
      <div class={`fixed top-0 left-0 h-1 w-full ${app.isLoading ? ` bg-secondary animate-pulse` : ''}`}></div>
    </>
  );
});
