import type { Signal }                                    from '@builder.io/qwik';
import { component$, useComputed$, useContext, useTask$ } from '@builder.io/qwik';
import { AppContext }                                     from "~/stores/appContext";
import { FilterContext }                                  from '~/stores/filterContext';

interface PaginationProps {
  mobileListDeckRef?: Signal<HTMLDivElement | undefined>;
}

export const Pagination = component$<PaginationProps>(({ mobileListDeckRef }) => {
  const filterContext = useContext(FilterContext);
  const appContext    = useContext(AppContext);

  const pagesComputed = useComputed$(() => {
    // get the current 5 pages
    const start = Math.max(1, filterContext.page - 2);
    const end   = Math.min(Math.ceil(filterContext.count / filterContext.size), start + 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  const isFirstPage = useComputed$(() => filterContext.page === 1);
  const isLastPage  = useComputed$(() => filterContext.page === Math.ceil(filterContext.count / filterContext.size));

  // reset scroll position on page change
  useTask$(({ track }) => {
    track(() => filterContext.page);

    mobileListDeckRef?.value?.scrollTo(0, 0);
  })

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
              pointerEvents:   isFirstPage.value ? 'none' : undefined
            }}
            onClick$={async () => {
              if (!isFirstPage.value) {
                appContext.isLoading = true;
                await filterContext.setPage(filterContext.page - 1);
                appContext.isLoading = false;
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
              pointerEvents:   isLastPage.value ? 'none' : undefined
            }}
            onClick$={async () => {
              if (!isLastPage.value) {
                appContext.isLoading = true;
                await filterContext.setPage(filterContext.page + 1);
                appContext.isLoading = false;
              }
            }}
          >
            Next
          </a>
        </div>
        <div class="hidden lg:flex lg:flex-1 lg:items-center lg:justify-between">
          <div class="px-2">
            <p class="text-sm text-gray-400">
              Showing {(filterContext.page - 1) * filterContext.size + 1} to {!isLastPage.value ? filterContext.page * filterContext.size : filterContext.count} results
              of {filterContext.count}
            </p>
          </div>
          <div>
            <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <a
                preventdefault:click
                onClick$={async () => {
                  if (!isFirstPage.value) {
                    appContext.isLoading = true;
                    await filterContext.setPage(1);
                    appContext.isLoading = false;
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
                    d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160zm352-160l-160 160c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L301.3 256 438.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0z"/>
                </svg>
              </a>
              <a
                href="#"
                preventdefault:click
                onClick$={async () => {
                  if (!isFirstPage.value) {
                    appContext.isLoading = true;
                    await filterContext.setPage(filterContext.page - 1);
                    appContext.isLoading = false;
                  }
                }}
                class={`${isFirstPage.value ?
                  'pointer-events-none' :
                  'hover:bg-gray-50'} relative inline-flex items-center  px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0`}>
                <span class="sr-only">Previous</span>
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd"
                        d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                        clip-rule="evenodd"/>
                </svg>
              </a>
              {pagesComputed.value.map(page => (
                <a
                  href="#" key={page}
                  preventdefault:click
                  class={`${filterContext.page === page ?
                    'font-semibold' :
                    ''} relative inline-flex items-center px-4 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0`}
                  onClick$={async () => {
                    appContext.isLoading = true;
                    await filterContext.setPage(page);
                    appContext.isLoading = false;
                  }}
                >
                  {page}
                </a>

              ))}
              <a
                preventdefault:click
                onClick$={async () => {
                  if (!isLastPage.value) {
                    appContext.isLoading = true;
                    await filterContext.setPage(filterContext.page + 1);
                    appContext.isLoading = false;
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
                        clip-rule="evenodd"/>
                </svg>
              </a>
              <a
                href="#"
                preventdefault:click
                onClick$={async () => {
                  const totalPages = Math.ceil(filterContext.count / filterContext.size);
                  if (!isLastPage.value) {
                    appContext.isLoading = true;
                    await filterContext.setPage(totalPages);
                    appContext.isLoading = false;
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
                    d="M470.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 256 265.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160zm-352 160l160-160c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L210.7 256 73.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0z"/>
                </svg>
              </a>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
});
