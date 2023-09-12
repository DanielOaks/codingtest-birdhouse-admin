// This composable provides some helper functions that deal with using the
//  ?page query parameter for pagination

// get the initial page number.
// try using Nuxt's router, then window.location, then default to page 1,
//  as sometimes Nuxt's router doesn't recognise the query string values when
//  loading a new page from the back button
export function useInitialPageNumber(): number {
  return parseInt(
    useRoute().query.page?.toString() ||
      new URLSearchParams(window.location.search).get("page")?.toString() ||
      "1",
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
