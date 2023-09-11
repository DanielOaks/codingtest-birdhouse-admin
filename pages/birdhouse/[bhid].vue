<template>
  <div class="flex h-full grow flex-col">
    <div class="flex h-full grow">
      <TheSidebar />
      <div
        class="flex-grow-1 flex w-full flex-col items-stretch overflow-y-auto p-8"
      >
        <div class="rounded-xl bg-sbgrey-400 p-5">
          <div class="flex justify-between">
            <h2 class="mb-2.5 text-xl font-semibold">
              {{ bh.birdhouse?.name }}
            </h2>
            <BirdhouseCardLocation
              extra-classes="mt-1"
              :latitude="bh.birdhouse?.latitude"
              :longitude="bh.birdhouse?.longitude"
            />
          </div>
          <div class="-mb-5 flex">
            <div
              class="tab-button"
              :class="activeTab === 'overview' ? 'active' : ''"
              @click="activeTab = 'overview'"
            >
              Overview
            </div>
            <div
              class="tab-button ml-8"
              :class="activeTab === 'graph' ? 'active' : ''"
              @click="activeTab = 'graph'"
            >
              Graph
            </div>
          </div>
        </div>
        <div v-if="activeTab === 'overview'" class="mt-1.5">
          <div
            v-for="(entry, index) in occupancyHistory"
            :key="index"
            class="mt-4 flex rounded-xl bg-sbgrey-400 p-5"
          >
            <span class="w-28">{{ entry.createdAt.toLocaleDateString() }}</span>
            <BirdhouseCardOccupancy
              extra-classes=""
              :birds="entry.birds"
              :eggs="entry.eggs"
            />
          </div>
        </div>
        <div v-if="activeTab === 'graph'">Graph</div>
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
const store = useBirdhousesStore();
const { $bhApi } = useNuxtApp();
const config = useRuntimeConfig();

const route = useRoute();

const bh = ref(NullRegistration);

const activeTab = ref("overview");

const loading = ref(true);

// only list unique entries
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

// populate store with info
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

<style scoped>
.tab-button {
  @apply cursor-pointer py-2.5 text-white opacity-40 transition-all;
}
.tab-button:hover,
.tab-button.active {
  @apply border-b border-sbpurple py-2.5 text-sbpurple opacity-100;
}
</style>
