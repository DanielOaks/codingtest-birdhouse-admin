<template>
  <div class="flex h-full grow flex-col">
    <div class="flex h-full grow overflow-y-auto">
      <TheSidebar />
      <div class="flex-grow-1 flex flex-wrap items-start gap-6 p-8">
        <template v-for="(bh, i) in pageItems.get(currentPage)" :key="i">
          <div v-if="bh.birdhouse" class="rounded-xl bg-sbgrey-400 p-5">
            <h2 class="mb-4 text-xl font-semibold" v-text="bh.birdhouse.name" />
            <div class="mb-2.5 flex text-sm">
              <IconLocationMarker class="mr-2.5 h-5" :font-controlled="false" />
              <span
                v-text="`(${bh.birdhouse.latitude}, ${bh.birdhouse.longitude})`"
              />
            </div>
            <div class="flex text-sm">
              <IconBirdhouse class="mr-2 h-5" :font-controlled="false" />
              <span v-text="0" />
              <IconEgg class="ml-3 mr-1.5 h-5" :font-controlled="false" />
              <span v-text="0" />
            </div>
          </div>
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
import IconLocationMarker from "@/assets/icons/location-marker.svg";
import IconBirdhouse from "@/assets/icons/birdhouse.svg";
import IconEgg from "@/assets/icons/egg.svg";

import { useBirdhousesStore } from "@/stores/birdhouses";
const store = useBirdhousesStore();
const { $bhApi } = useNuxtApp();

// populate store with info
if ($bhApi !== undefined) {
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
