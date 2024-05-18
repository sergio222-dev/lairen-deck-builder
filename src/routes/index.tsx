import { component$, useComputed$, useContext } from '@builder.io/qwik';
import { UserContext }                          from './layout';
import { createClientBrowser } from '~/lib/supabase-qwik';
import { useLogin, useLogout } from '~/actions/user';

export default component$(() => {
    const c = useContext(UserContext);

    const isLoggedIn = useComputed$(async () => {
        return c.value !== null;
    });

    const logout = useLogout();
    const login = useLogin();

    return (
        <>
            {!isLoggedIn.value && (
                <div class="shadow-md w-fit hover:shadow-xl transition-shadow duration-300">
                    <a onClick$={async () => {
                        const data = await login.submit();

                        // redirect
                        if (data.value.url) window.location.href = data.value.url;
                    }} class="flex p-4 gap-4" preventdefault:click href="#"
                    >
                        <div>

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 488 512"
                                width={24}
                            >
                                <path
                                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                            </svg>
                        </div>
                        Login with Google
                    </a>
                </div>
            )}

            {isLoggedIn.value && <button onClick$={async () => {
                const supabaseClient = createClientBrowser();
                await supabaseClient.auth.signOut();

                logout.submit();

            }}>Logout</button>}
        </>
    );
});
