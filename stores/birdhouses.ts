import { defineStore, acceptHMRUpdate } from "pinia";
import BhApi from "@danieloaks/codingtest-birdhouse-js/dist/index";
import { Registration } from "@danieloaks/codingtest-birdhouse-js/dist/module/registration";

export const useBirdhousesStore = defineStore("birdhouses", () => {
  const totalItems = ref(0);
  const pageItems = ref(new Map<number, Registration[]>());
  const birdhouseInfo = ref(new Map<string, Registration>());
  const currentPage = ref(1);
  const totalPages = ref(0);

  async function getPage(api: BhApi, page: number): Promise<Registration[]> {
    let items = pageItems.value.get(page);

    if (items === undefined) {
      console.log(`Calling API to get registrations for page ${page}`);
      const res = await api.registration.getRegistrations({
        page,
        limit: 4,
      });
      totalItems.value = res.meta.totalItems;
      totalPages.value = res.meta.totalPages;

      items = [];
      res.items.forEach((item) => {
        items?.push(item);

        if (item.birdhouse) {
          birdhouseInfo.value.set(item.value, item);
        }
      });
      pageItems.value.set(page, items);
    }

    return items;
  }

  function changeToPage(page: number) {
    currentPage.value = page;
  }

  return {
    totalItems,
    currentPage,
    totalPages,
    getPage,
    changeToPage,
    pageItems,
    birdhouseInfo,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBirdhousesStore, import.meta.hot));
}
