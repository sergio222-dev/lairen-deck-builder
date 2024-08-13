import { component$, useComputed$, useContext } from '@builder.io/qwik';
import { FilterContext }                        from '~/stores/filterContext';

export const Pagination = component$(() => {
  const c = useContext(FilterContext);

  const pagesComputed = useComputed$(() => {
    // get the current 5 pages
    const start = Math.max(1, c.page - 2);
    const end   = Math.min(Math.ceil(c.count / c.size), start + 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  const isFirstPage = useComputed$(() => c.page === 1);
  const isLastPage  = useComputed$(() => c.page === Math.ceil(c.count / c.size));

  return (
    <div>
      <div class="flex items-center justify-between bg-white py-2">
        <div class="flex flex-1 justify-between lg:hidden">
          <a
            href="#"
            preventdefault:click
            class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            style={{
              backgroundColor: isFirstPage.value ? 'gray' : '',
              pointerEvents: isFirstPage.value ? 'none' : undefined
            }}
            onClick$={async () => {
              if (!isFirstPage.value) {
                void c.setPage(c.page - 1);
              }
            }}
          >
            Previous
          </a>
          <a
            preventdefault:click
            href="#"
            class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            style={{
              backgroundColor: isLastPage.value ? 'gray' : '',
              pointerEvents: isLastPage.value ? 'none' : undefined
            }}
            onClick$={async () => {
              if (!isLastPage.value) {
                void c.setPage(c.page + 1);
              }
            }}
          >
            Next
          </a>
        </div>
        <div class="hidden lg:flex lg:flex-1 lg:items-center lg:justify-between">
          <div class="px-2">
            <p class="text-sm text-gray-400">
              Showing {(c.page - 1) * c.size + 1} to {!isLastPage.value ? c.page * c.size : c.count} results
              of {c.count}
            </p>
          </div>
          <div>
            <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <a
                preventdefault:click
                onClick$={async () => {
                  if (!isFirstPage.value) {
                    void c.setPage(1);
                  }
                }}
                href="#"
                class={`${isFirstPage.value ?
                  'pointer-events-none' :
                  'hover:bg-gray-50'} relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300  focus:z-20 focus:outline-offset-0`}
              >
                <span class="sr-only">First</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  class="h-3 w-3"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160zm352-160l-160 160c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L301.3 256 438.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0z" />
                </svg>
              </a>
              <a
                href="#"
                preventdefault:click
                onClick$={async () => {
                  if (!isFirstPage.value) {
                    void c.setPage(c.page - 1);
                  }
                }}
                class={`${isFirstPage.value ?
                  'pointer-events-none' :
                  'hover:bg-gray-50'} relative inline-flex items-center  px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0`}>
                <span class="sr-only">Previous</span>
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd"
                        d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                        clip-rule="evenodd" />
                </svg>
              </a>
              {pagesComputed.value.map(page => (
                <a
                  href="#" key={page}
                  preventdefault:click
                  class={`${c.page === page ?
                    'font-semibold' :
                    ''} relative inline-flex items-center px-4 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0`}
                  onClick$={async () => {
                    void c.setPage(page);
                  }}
                >
                  {page}
                </a>

              ))}
              <a
                preventdefault:click
                onClick$={async () => {
                  if (!isLastPage.value) {
                    void c.setPage(c.page + 1);
                  }
                }}
                href="#"
                class={`${isLastPage.value ?
                  'pointer-events-none' :
                  'hover:bg-gray-50'} relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0`}>
                <span class="sr-only">Next</span>
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd"
                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                        clip-rule="evenodd" />
                </svg>
              </a>
              <a
                href="#"
                preventdefault:click
                onClick$={async () => {
                  const totalPages = Math.ceil(c.count / c.size);
                  if (!isLastPage.value) {
                    void c.setPage(totalPages);
                  }
                }}
                class={`${isLastPage.value ?
                  'pointer-events-none' :
                  'hover:bg-gray-50'} relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0`}
              >
                <span class="sr-only">Last</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  class="h-3 w-3"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M470.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 256 265.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160zm-352 160l160-160c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L210.7 256 73.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0z" />
                </svg>
              </a>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
});
