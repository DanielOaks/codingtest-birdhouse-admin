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
  birdhouse: {
    ubid: "0",
    name: "Null Birdhouse",
    latitude: 0,
    longitude: 0,
    lastOccupationUpdate: new Date(),
    occupancyHistory: [],
  },
};

export const useBirdhousesStore = defineStore("birdhouses", () => {
  const itemsPerPage = ref(4);
  const totalItems = ref(0);
  const pageItems = ref(new Map<number, string[]>());
  const birdhouseInfo = ref(new Map<string, Registration>());
  const currentPage = ref(1);
  const totalPages = ref(0);
  const occupancyUpdatesToGrab = ref(15);

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
      console.log("Clearing existing page items");
      pageItems.value.clear();
    }

    if (
      options.occupancyUpdatesToGrab &&
      options.occupancyUpdatesToGrab !== occupancyUpdatesToGrab.value
    ) {
      occupancyUpdatesToGrab.value = options.occupancyUpdatesToGrab;

      // clear all occupancy history info
      console.log("Clearing existing occupancy history");
      birdhouseInfo.value.forEach((info: Registration, _key: string) => {
        while (info.birdhouse?.occupancyHistory.length) {
          info.birdhouse?.occupancyHistory.pop();
        }
      });
    }
  }

  async function getPage(
    api: BhApi,
    page: number,
    getCurrentOccupancy: boolean,
  ): Promise<Registration[]> {
    let items = pageItems.value.get(page);

    if (items === undefined) {
      console.log(`Calling API to get registrations for page ${page}`);
      const res = await api.registration.getRegistrationPage(
        page,
        itemsPerPage.value,
      );
      totalItems.value = res.meta.totalItems;
      totalPages.value = res.meta.totalPages;

      items = [];
      for (const item of res.items) {
        const newRegistration = item as Registration;

        if (newRegistration.birdhouse && getCurrentOccupancy) {
          console.log("  Getting occupancy for", item.value);
          const occupancyRes = await api.occupancy.getOccupancy(
            newRegistration.birdhouse.ubid,
            1,
            occupancyUpdatesToGrab.value,
          );

          if (occupancyRes.items) {
            newRegistration.birdhouse.currentOccupancy = {
              eggs: occupancyRes.items[0].eggs,
              birds: occupancyRes.items[0].birds,
            };
          }
        }

        items?.push(item.value);

        if (item.birdhouse) {
          birdhouseInfo.value.set(item.value, newRegistration);
        }
      }
      pageItems.value.set(page, items);
    }

    return items.map((key) => birdhouseInfo.value.get(key) || NullRegistration);
  }

  async function getBirdhouseInfo(
    api: BhApi,
    bhid: string,
  ): Promise<Registration> {
    if (birdhouseInfo.value.get(bhid) === undefined) {
      console.log(`Calling API to get registration of birdhouse ${bhid}`);
      const res = await api.registration.getRegistration(bhid);

      const newRegistration = res as Registration;

      if (res.birdhouse) {
        birdhouseInfo.value.set(res.value, newRegistration);
      } else {
        // no birdhouse registered here, we shouldn't get occupancy below
        return newRegistration;
      }
    }

    if (!birdhouseInfo.value.get(bhid)?.birdhouse?.occupancyHistory.length) {
      console.log(`Calling API to get occupancy of birdhouse ${bhid}`);
      await getOccupancy(api, bhid, 1);
    }

    return birdhouseInfo.value.get(bhid) || NullRegistration;
  }

  function changeToPage(page: number) {
    currentPage.value = page;
  }

  async function getOccupancy(api: BhApi, bhid: string, page: number) {
    const registration: Registration | undefined =
      birdhouseInfo.value.get(bhid);

    if (!registration?.birdhouse) {
      throw new Error(
        `Birdhouse ${bhid} does not have a registration grabbed or does not have a birdhouse`,
      );
    }

    const items = registration?.birdhouse?.occupancyHistory || [];

    if (registration.birdhouse !== undefined && items.length === 0) {
      const res = await api.occupancy.getOccupancy(
        bhid,
        page,
        occupancyUpdatesToGrab.value,
      );

      res.items.forEach((item) => {
        const newState: OccupancyState = item;
        items.push(newState);
      });
      registration.birdhouse.occupancyHistory = items;
      birdhouseInfo.value.set(bhid, registration);
    }
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
    getOccupancy,
    birdhouseInfo,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBirdhousesStore, import.meta.hot));
}
