<template>
  <div class="flex h-full grow flex-col">
    <div class="flex h-full grow">
      <TheSidebar />
      <div
        class="flex-grow-1 flex flex-wrap items-start gap-6 overflow-y-auto p-8"
      >
        <template v-for="(bh, i) in pageItems.get(currentPage)" :key="i">
          <BirdhouseCard
            :info="birdhouseInfo.get(bh) || NullRegistration"
            @click.prevent="
              birdhouseInfo.get(bh)?.birdhouse
                ? navigateTo(`/birdhouses/${bh}`)
                : console.log(
                    'Prevented navigation to unregistered birdhouse',
                    bh,
                  )
            "
          />
        </template>
      </div>
    </div>
    <div class="flex flex-shrink-0 items-center justify-center bg-sbgrey-400">
      <AppPaginator
        :total-items="totalPages"
        :current-item="currentPage"
        @select-item="changeToPage"
      />
    </div>
    <TheLoadingModal :loading="loading" />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useBirdhousesStore, NullRegistration } from "@/stores/birdhouses";

// initialise page
const loading = ref(true);

// metadata
useHead({
  title: "BirdHouse List",
});

// setup store info and functions
const store = useBirdhousesStore();
const { $bhApi } = useNuxtApp();
const config = useRuntimeConfig();

const { pageItems, birdhouseInfo, currentPage, totalPages } =
  storeToRefs(store);

async function changeToPage(newPage: number) {
  loading.value = true;
  await store.getPage(
    $bhApi,
    newPage,
    config.public.loadOccupancyDetailsOnList,
  );
  store.changeToPage(newPage);
  loading.value = false;
}

// populate store with initial info
async function populate() {
  if ($bhApi !== undefined) {
    store.setConfig({
      itemsPerPageLimit: config.public.cardsPerPage,
    });
    await store.getPage($bhApi, 1, config.public.loadOccupancyDetailsOnList);
    store.changeToPage(1);
  }
  loading.value = false;
}

populate();
</script>
