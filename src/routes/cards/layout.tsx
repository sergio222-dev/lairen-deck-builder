import type { RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = async ({ cacheControl }) => {
    cacheControl({
        public:               true,
        maxAge:               5,
        staleWhileRevalidate: 60 * 60 * 24 * 7,
    })
}
