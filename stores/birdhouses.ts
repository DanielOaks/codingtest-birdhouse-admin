import { defineStore, acceptHMRUpdate } from "pinia";
import BhApi from "@danieloaks/codingtest-birdhouse-js/dist/index";

// interfaces we expose to the app
export interface Registration {
  value: string;
  birdhouse?: {
    ubidValue: string;
    name: string;
    latitude: number;
    longitude: number;
    lastOccupationUpdate: Date;
    currentOccupancy?: {
      eggs: number;
      birds: number;
    };
  };
}

export const NullRegistration: Registration = {
  value: "0",
  birdhouse: {
    ubidValue: "0",
    name: "Null Birdhouse",
    latitude: 0,
    longitude: 0,
    lastOccupationUpdate: new Date(),
  },
};

export interface OccupancyState {
  id: string;
  eggs: number;
  birds: number;
  createdAt: Date;
}

export interface OccupancyPageState {
  currentPage: number;
  totalPages: number;
}

export const useBirdhousesStore = defineStore("birdhouses", () => {
  // if these values are changed we will need to re-grab data
  const registrationItemsPerPage = ref(4);
  const occupancyStatesPerPage = ref(15);

  function setConfig(options: {
    registrationItemsPerPage?: number;
    occupancyStatesPerPage?: number;
  }) {
    if (
      options.registrationItemsPerPage &&
      options.registrationItemsPerPage !== registrationItemsPerPage.value
    ) {
      registrationItemsPerPage.value = options.registrationItemsPerPage;

      // our existing number of items per page won't match
      console.log("Clearing existing page items");
      registrationPageItems.value.clear();
    }

    if (
      options.occupancyStatesPerPage &&
      options.occupancyStatesPerPage !== occupancyStatesPerPage.value
    ) {
      occupancyStatesPerPage.value = options.occupancyStatesPerPage;

      // clear all occupancy history info
      console.log("Clearing existing occupancy history");
      occupancyPageInfo.value.clear();
      occupancyHistory.value.clear();
    }
  }

  // birdhouse registrations
  const currentRegistrationListPage = ref(1);
  const totalRegistrationItems = ref(0);
  const totalRegistrationPages = ref(0);
  const registrationPageItems = ref(new Map<number, string[]>());
  const registrationInfo = ref(new Map<string, Registration>());

  async function getCurrentOccupancyForBirdhouse(
    api: BhApi,
    ubid: string,
  ): Promise<{ eggs: number; birds: number } | undefined> {
    const info = await api.occupancy.getOccupancy(ubid, 1, 1);

    if (info.items.length > 0) {
      return {
        eggs: info.items[0].eggs,
        birds: info.items[0].birds,
      };
    }
  }

  async function setRegistrationPage(
    api: BhApi,
    page: number,
    getCurrentOccupancy: boolean,
  ) {
    // try existing info
    let items = registrationPageItems.value.get(page);
    if (items !== undefined) {
      currentRegistrationListPage.value = page;
      return;
    }

    // get new info
    console.log(`Calling API to get registrations for page ${page}`);
    const res = await api.registration.getRegistrationPage(
      page,
      registrationItemsPerPage.value,
    );
    totalRegistrationItems.value = res.meta.totalItems;
    totalRegistrationPages.value = res.meta.totalPages;

    items = [];
    const allOccupancyCalls = [];
    for (const item of res.items) {
      const newRegistration = item as Registration;

      if (newRegistration.birdhouse && getCurrentOccupancy) {
        // we add this occupancy call to our list, and then do all of them at
        //  once below. this improves performance a lot compared to doing them
        //  one-by-one
        const currentName = newRegistration.birdhouse.name;
        const currentID = item.value;

        allOccupancyCalls.push(async (): Promise<boolean> => {
          console.log("Getting current occupancy for", currentName);
          const reg = registrationInfo.value.get(currentID);
          if (reg === undefined || reg.birdhouse === undefined) {
            return false;
          }
          reg.birdhouse.currentOccupancy =
            await getCurrentOccupancyForBirdhouse(api, newRegistration.value);

          registrationInfo.value.set(currentID, reg);

          return true;
        });
      }

      items?.push(item.value);

      if (item.birdhouse) {
        registrationInfo.value.set(item.value, newRegistration);
      }
    }
    registrationPageItems.value.set(page, items);

    // perform all the registration calls, if any exist
    await Promise.all(allOccupancyCalls.map((f) => f()));

    currentRegistrationListPage.value = page;
  }

  async function getBaseRegistrationInfo(
    api: BhApi,
    bhid: string,
  ): Promise<Registration> {
    // try existing info
    const currentRegistrationInfo = registrationInfo.value.get(bhid);
    if (currentRegistrationInfo !== undefined) {
      return currentRegistrationInfo;
    }

    // get new info
    console.log(`Calling API to get registration of birdhouse ${bhid}`);
    const res = await api.registration.getRegistration(bhid);

    const newRegistration = res as Registration;

    if (res.birdhouse) {
      registrationInfo.value.set(res.value, newRegistration);
      return newRegistration;
    } else {
      // no birdhouse registered here, we shouldn't get occupancy below
      return newRegistration;
    }
  }

  // birdhouse occupancy
  const occupancyPageInfo = ref(new Map<string, OccupancyPageState>());
  const occupancyHistory = ref(
    new Map<string, Map<number, OccupancyState[]>>(),
  );

  function setCurrentOccupancyInfo(
    bhid: string,
    page: number,
    totalPages: number | undefined,
  ) {
    const currentOccupancyInfo: OccupancyPageState =
      occupancyPageInfo.value.get(bhid) || { currentPage: 0, totalPages: 0 };

    currentOccupancyInfo.currentPage = page;
    if (totalPages !== undefined) {
      currentOccupancyInfo.totalPages = totalPages;
    }

    occupancyPageInfo.value.set(bhid, currentOccupancyInfo);
  }

  async function setOccupancyPage(api: BhApi, bhid: string, page: number) {
    // try existing info
    let currentOhMap =
      occupancyHistory.value.get(bhid) || new Map<number, OccupancyState[]>();
    const items: OccupancyState[] = currentOhMap.get(page) || [];

    if (items.length > 0) {
      setCurrentOccupancyInfo(bhid, page, undefined);
      // we already have the states for this page, no need to call the API
      return;
    }

    // get new info
    console.log(
      `Calling API to get occupancy of birdhouse ${bhid}, page ${page}`,
    );

    const res = await api.occupancy.getOccupancy(
      bhid,
      page,
      occupancyStatesPerPage.value,
    );

    for (const item of res.items) {
      items.push(item);
    }

    // re-grab, just in case the state changed in the meantime
    currentOhMap =
      occupancyHistory.value.get(bhid) || new Map<number, OccupancyState[]>();

    currentOhMap.set(page, items);
    occupancyHistory.value.set(bhid, currentOhMap);

    // now that we have the data, change the page
    setCurrentOccupancyInfo(bhid, page, res.meta.totalPages);
  }

  return {
    // base
    setConfig,

    // registration
    currentRegistrationListPage,
    totalRegistrationPages,
    registrationPageItems,
    registrationInfo,
    setRegistrationPage,
    getBaseRegistrationInfo,

    // occupancy
    occupancyPageInfo,
    occupancyHistory,
    setOccupancyPage,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBirdhousesStore, import.meta.hot));
}
