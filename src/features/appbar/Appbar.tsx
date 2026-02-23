import { component$, useContext, useSignal, useTask$ } from '@builder.io/qwik';
import { Link, useLocation, useNavigate } from '@builder.io/qwik-city';
import { Avatar }                                      from "~/components/avatar/Avatar";
import { Icon }                                        from "~/components/icons/Icon";
import { createClientBrowser }                         from "~/lib/supabase-qwik";
import { AppContext }                                  from "~/stores/appContext";
import { USER_CONTEXT }                                from "~/UI/user/store/user.store";

export const Appbar = component$(() => {
    const location   = useLocation();
    const navigate = useNavigate();
    const isMenuOpen = useSignal(false);

    const userStore = useContext(USER_CONTEXT);
    const app       = useContext(AppContext);

    useTask$(async ({ track }) => {
        track(() => location.isNavigating);

        app.isLoading = location.isNavigating;
    });

    return (
            <>
                <header class="w-full py-2 px-4 bg-primary text-white relative">
                    <div class="absolute top-0 right-0">
                    </div>
                    <div class="flex justify-between h-16 items-center">
                        <div class="flex items-center">
                            <Link onClick$={() => isMenuOpen.value = false} rel="noopener noreferrer" href="/"
                                  aria-label="Back to homepage" class="flex items-center p-2">
                                <h2 class="font-bold text-2xl">LDB</h2>
                            </Link>
                        </div>
                        <div class="sm:hidden flex items-center gap-4">
                            {userStore.user &&
                                    <Avatar image={userStore.user.avatar_url}/>
                            }
                            <div class="sm:hidden cursor-pointer p-4"
                                 onClick$={() => isMenuOpen.value = !isMenuOpen.value}>
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
                                {!userStore.user &&
                                        (<>
                                                    <li class="flex cursor-pointer">
                                                        <Link onClick$={() => isMenuOpen.value = false}
                                                              rel="noopener noreferrer" href="/decks/create"
                                                              class="flex items-center px-2 ">Create Deck</Link>
                                                    </li>
                                                    <li class="flex cursor-pointer">
                      <span class="flex items-center gap-2" onClick$={async () => {
                          // const data = await login.submit();
                          const response = await fetch("/api/login", {
                              method: "POST",
                          })

                          const data = await response.json()

                          if (data) {
                              window.location.href = JSON.parse(data).url
                          }
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
                                {userStore.user &&
                                        (<>
                                                    <li class="flex">
                                                        <Link rel="noopener noreferrer" href="/mydecks"
                                                              class="flex items-center px-4 ">My decks</Link>
                                                    </li>
                                                    <li class="flex">
                                                        <Link rel="noopener noreferrer" href="/album"
                                                              class="flex items-center px-4 ">Album</Link>
                                                    </li>
                                                    <li class="flex cursor-pointer">
                      <span onClick$={async () => {
                          await fetch("/api/logout", {
                              method: "POST",
                          })

                          const c = createClientBrowser();
                          await c.auth.signOut(); // have to use it, onAuthStateChange is not fired when the call is done in the server.
                      }}
                            class="flex items-center px-4 ">Logout</span>
                                                    </li>
                                                </>
                                        )}
                            </ul>
                            {userStore.user &&
                                    <Avatar image={userStore.user.avatar_url}/>
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
                            {!userStore.user &&
                                    (<>
                                                <li class="flex cursor-pointer">
                                                    <Link onClick$={() => isMenuOpen.value = false}
                                                          rel="noopener noreferrer" href="/decks/create"
                                                          class="flex items-center px-2 ">Create Deck</Link>
                                                </li>
                                                <li class="flex">
                      <span class="flex items-center gap-2 px-2 cursor-pointer" onClick$={async () => {
                          const response = await fetch("/api/login", {
                              method: "POST",
                          })

                          const data = await response.json()

                          if (data) {
                              window.location.href = JSON.parse(data).url
                          }
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
                            {userStore.user && (
                                    <>
                                        <li class="flex">
                                            <Link onClick$={() => isMenuOpen.value = false} rel="noopener noreferrer"
                                                  href="/mydecks"
                                                  class="flex items-center px-2 ">My decks</Link>
                                        </li>
                                        <li class="flex">
                                            <Link onClick$={() => isMenuOpen.value = false} rel="noopener noreferrer"
                                                  href="#"
                                                  class="flex items-center px-2 ">Collection</Link>
                                        </li>
                                        <li class="flex">
                      <span onClick$={async () => {
                          await fetch("/api/logout", {
                              method: "POST",
                          })

                          const supabaseClient = createClientBrowser();
                          await supabaseClient.auth.signOut();
                      }}
                            class="flex items-center px-2 cursor-pointer">Logout</span>
                                        </li>
                                    </>
                            )}
                        </ul>
                    </div>
                </header>
                <div class={`fixed top-0 left-0 h-1 w-full ${app.isLoading ?
                        ` bg-secondary animate-pulse` :
                        ''}`}></div>
            </>
    );
});
