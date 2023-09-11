import { defineStore, acceptHMRUpdate } from "pinia";
import BhApi from "@danieloaks/codingtest-birdhouse-js/dist/index";
import { Registration as BhmRegistration } from "@danieloaks/codingtest-birdhouse-js/dist/module/registration";
import { OccupancyState as BhmOccupancyState } from "@danieloaks/codingtest-birdhouse-js/dist/module/occupancy";

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

function constructRegistration(item: BhmRegistration): Registration {
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
  return newRegistration;
}

function constructOccupancyState(item: BhmOccupancyState): OccupancyState {
  const newOS: OccupancyState = {
    id: item.id,
    eggs: item.eggs,
    birds: item.birds,
    createdAt: new Date(item.created_at),
  };
  return newOS;
}

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
      const res = await api.registration.getRegistrationPage(
        page,
        itemsPerPage.value,
      );
      totalItems.value = res.meta.totalItems;
      totalPages.value = res.meta.totalPages;

      items = [];
      res.items.forEach((item) => {
        const newRegistration = constructRegistration(item);

        items?.push(item.value);

        if (item.birdhouse) {
          birdhouseInfo.value.set(item.value, newRegistration);
        }
      });
      pageItems.value.set(page, items);
    }
  }

  async function getBirdhouseInfo(
    api: BhApi,
    bhid: string,
  ): Promise<Registration> {
    if (birdhouseInfo.value.get(bhid) === undefined) {
      console.log(`Calling API to get registration of birdhouse ${bhid}`);
      const res = await api.registration.getRegistration(bhid);

      const newRegistration = constructRegistration(res);

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
    const registration: Registration = birdhouseInfo.value.get(bhid);
    const items = registration?.birdhouse?.occupancyHistory || [];

    if (!registration?.birdhouse) {
      throw new Error(
        `Birdhouse ${bhid} does not have a registration grabbed or does not have a birdhouse`,
      );
    }

    if (registration?.birdhouse !== undefined && items.length === 0) {
      console.log(
        `Calling API to get occupancy for bhid ${bhid}: page ${page}`,
      );
      const res = await api.occupancy.getOccupancy(
        bhid,
        page,
        occupancyUpdatesToGrab.value,
      );

      res.items.forEach((item) => {
        const newState = constructOccupancyState(item);
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
