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
                ? navigateTo(`/birdhouse/${bh}`)
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
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useBirdhousesStore, NullRegistration } from "@/stores/birdhouses";
const store = useBirdhousesStore();
const { $bhApi } = useNuxtApp();
const config = useRuntimeConfig();

useHead({
  title: "BirdHouse List",
});

// populate store with info
if ($bhApi !== undefined) {
  store.setConfig({
    itemsPerPageLimit: config.public.cardsPerPage,
  });
  await store.getPage($bhApi, 1);
  store.changeToPage(1);
}

async function changeToPage(newPage: number) {
  await store.getPage($bhApi, newPage);
  store.changeToPage(newPage);
}

const { pageItems, birdhouseInfo, currentPage, totalPages } =
  storeToRefs(store);
</script>
