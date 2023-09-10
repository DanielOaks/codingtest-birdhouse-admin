import { defineStore, acceptHMRUpdate } from "pinia";
import BhApi from "@danieloaks/codingtest-birdhouse-js/dist/index";
import { Registration } from "@danieloaks/codingtest-birdhouse-js/dist/module/registration";

export const useBirdhousesStore = defineStore("birdhouses", () => {
  const totalItems = ref(0);
  const pageItems = ref(new Map<number, Registration[]>());
  const birdhouseInfo = ref(new Map<string, Registration>());

  async function getPage(api: BhApi, page: number): Promise<Registration[]> {
    let items = pageItems.value.get(page);

    if (items === undefined) {
      console.log(`Calling API to get registrations for page ${page}`);
      const res = await api.registration.getRegistrations({
        page: 1,
        limit: 4,
      });
      totalItems.value = res.meta.totalItems;

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

  return { totalItems, getPage, pageItems, birdhouseInfo };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBirdhousesStore, import.meta.hot));
}
