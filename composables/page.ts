// This composable provides some helper functions that deal with using the
//  ?page query parameter for pagination

// get the initial page number.
// try using Nuxt's router, then window.location, then default to page 1,
//  as sometimes Nuxt's router doesn't recognise the query string values when
//  loading a new page from the back button
export function useInitialPageNumber(): number {
  const routerPage = useRoute().query.page?.toString();
  const windowPage = new URLSearchParams(window.location.search)
    .get("page")
    ?.toString();

  // when running navigateTo() to visit a new page, the router may still
  //  contain the old page's query parameters in the <setup> function...
  // we use this to check whether the router and window.location are in sync,
  //  and if so we can rely on the router's query parameters as being accurate
  const windowLocationMatches = useRoute().path === window.location.pathname;

  return parseInt(
    (windowLocationMatches ? routerPage : undefined) || windowPage || "1",
  );
}

interface newPageCallback {
  (newPage: number): void;
}

// see and respond to popstate events, which is when we go back to different
//  query params on the same page!
export function usePopStatePage(callback: newPageCallback) {
  const respondToNewPopState = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const newPage = parseInt(urlParams.get("page")?.toString() || "1");
    console.log("new pop state with page", newPage);
    callback(newPage);
  };

  onMounted(() => {
    if (process.client) {
      window.addEventListener("popstate", respondToNewPopState);
    }
  });

  onUnmounted(() => {
    if (process.client) {
      window.removeEventListener("popstate", respondToNewPopState);
    }
  });
}
