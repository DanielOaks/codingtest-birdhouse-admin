import { defineStore, acceptHMRUpdate } from "pinia";
import BhApi from "@danieloaks/codingtest-birdhouse-js/dist/index";

export interface OccupancyState {
  id: string;
  eggs: number;
  birds: number;
  createdAt: Date;
}

export interface Registration {
  value: string;
  birdhouse?: {
    ubid: string;
    name: string;
    latitude: number;
    longitude: number;
    lastOccupationUpdate: Date;
    currentOccupancy?: {
      eggs: number;
      birds: number;
    };
    occupancyHistory: OccupancyState[];
  };
}

export const NullRegistration: Registration = {
  value: "0",
};

export const useBirdhousesStore = defineStore("birdhouses", () => {
  const itemsPerPage = ref(4);
  const totalItems = ref(0);
  const pageItems = ref(new Map<number, string[]>());
  const birdhouseInfo = ref(new Map<string, Registration>());
  const currentPage = ref(1);
  const totalPages = ref(0);
  const occupancyUpdatesToGrab = ref(10);

  function setConfig(options: {
    itemsPerPageLimit?: number;
    occupancyUpdatesToGrab?: number;
  }) {
    if (
      options.itemsPerPageLimit &&
      options.itemsPerPageLimit !== itemsPerPage.value
    ) {
      itemsPerPage.value = options.itemsPerPageLimit;

      // our existing number of items per page won't match
      pageItems.value.clear();
    }

    if (
      options.occupancyUpdatesToGrab &&
      options.occupancyUpdatesToGrab !== occupancyUpdatesToGrab.value
    ) {
      occupancyUpdatesToGrab.value = options.occupancyUpdatesToGrab;

      // clear all occupancy history info
      birdhouseInfo.value.forEach((info: Registration, _key: string) => {
        while (info.birdhouse?.occupancyHistory.length) {
          info.birdhouse?.occupancyHistory.pop();
        }
      });
    }
  }

  async function getPage(api: BhApi, page: number) {
    let items = pageItems.value.get(page);

    if (items === undefined) {
      console.log(`Calling API to get registrations for page ${page}`);
      const res = await api.registration.getRegistrations({
        page,
        limit: itemsPerPage.value,
      });
      totalItems.value = res.meta.totalItems;
      totalPages.value = res.meta.totalPages;

      items = [];
      res.items.forEach((item) => {
        const newRegistration: Registration = {
          value: item.value,
        };
        if (item.birdhouse) {
          newRegistration.birdhouse = {
            ubid: item.birdhouse.ubidValue,
            name: item.birdhouse.name,
            latitude: item.birdhouse.latitude,
            longitude: item.birdhouse.longitude,
            lastOccupationUpdate: new Date(item.birdhouse.lastOccupationUpdate),
            occupancyHistory: [],
          };
        }

        items?.push(item.value);

        if (item.birdhouse) {
          birdhouseInfo.value.set(item.value, newRegistration);
        }
      });
      pageItems.value.set(page, items);
    }
  }

  async function getBirdhouseInfo(bhid: string): Promise<Registration> {
    if (birdhouseInfo.value.get(bhid) === undefined) {
      await console.log(`Calling API to get registration of birdhouse ${bhid}`);
    }

    if (!birdhouseInfo.value.get(bhid)?.birdhouse?.occupancyHistory.length) {
      await console.log(`Calling API to get occupancy of birdhouse ${bhid}`);
    }

    return birdhouseInfo.value.get(bhid) || NullRegistration;
  }

  function changeToPage(page: number) {
    currentPage.value = page;
  }

  return {
    setConfig,
    totalItems,
    currentPage,
    totalPages,
    getPage,
    changeToPage,
    pageItems,
    getBirdhouseInfo,
    birdhouseInfo,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBirdhousesStore, import.meta.hot));
}