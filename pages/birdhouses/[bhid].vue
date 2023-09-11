<template>
  <div class="flex h-full grow flex-col">
    <div class="flex h-full grow">
      <TheSidebar />
      <div
        class="flex-grow-1 flex w-full flex-col items-stretch overflow-y-auto p-8"
      >
        <div class="rounded-xl bg-sbgrey-400 p-6">
          <div class="flex justify-between">
            <h2 class="mb-2.5 text-xl font-semibold">
              {{ bh.birdhouse?.name }}
            </h2>
            <BirdhouseLocationSnippet
              extra-classes="mt-1"
              :latitude="bh.birdhouse?.latitude"
              :longitude="bh.birdhouse?.longitude"
            />
          </div>
          <div class="-mb-6 flex">
            <AppTabButton
              name="Overview"
              :active-tab="activeTab"
              @click="tabButtonClicked"
            />
            <AppTabButton
              name="Graph"
              :active-tab="activeTab"
              @click="tabButtonClicked"
            />
          </div>
        </div>
        <AppTab name="Overview" :active-tab="activeTab">
          <div class="mt-1.5">
            <div
              v-for="(entry, index) in occupancyHistory"
              :key="index"
              class="mt-4 flex rounded-xl bg-sbgrey-400 p-5"
            >
              <span class="w-28">{{
                entry.createdAt.toLocaleDateString()
              }}</span>
              <BirdhouseOccupancySnippet
                extra-classes=""
                :birds="entry.birds"
                :eggs="entry.eggs"
              />
            </div>
          </div>
        </AppTab>
        <AppTab name="Graph" :active-tab="activeTab"> Graph goes here. </AppTab>
      </div>
    </div>
    <div class="flex flex-shrink-0 items-center justify-center bg-sbgrey-400">
      <AppPaginator :total-items="1" :current-item="1" />
    </div>
    <TheLoadingModal :loading="loading" />
  </div>
</template>

<script setup lang="ts">
import {
  useBirdhousesStore,
  NullRegistration,
  OccupancyState,
} from "@/stores/birdhouses";

// initialise page
const loading = ref(true);

// setup tabs
const activeTab = ref("Overview");

function tabButtonClicked(newTab: string) {
  activeTab.value = newTab;
}

// setup store info and functions
const store = useBirdhousesStore();
const { $bhApi } = useNuxtApp();
const config = useRuntimeConfig();
const route = useRoute();

const bh = ref(NullRegistration);

// only list unique history entries
const occupancyHistory = computed(() => {
  const existingDays: string[] = [];
  const items: OccupancyState[] = [];

  bh.value.birdhouse?.occupancyHistory.forEach((item) => {
    const thisItemToday = item.createdAt.toLocaleDateString();

    if (existingDays.includes(thisItemToday)) {
      return;
    }

    existingDays.push(thisItemToday);
    items.push(item);
  });

  return items;
});

// populate store with initial info
async function populate() {
  if ($bhApi !== undefined) {
    store.setConfig({
      occupancyUpdatesToGrab: config.public.occupancyUpdatesToGrab,
    });
    const newBh = await store.getBirdhouseInfo(
      $bhApi,
      route.params.bhid.toString(),
    );

    bh.value = newBh;
  }

  useHead({
    title: bh.value.birdhouse?.name,
  });

  loading.value = false;
}

populate();
</script>
