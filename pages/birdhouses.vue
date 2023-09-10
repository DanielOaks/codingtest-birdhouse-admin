<template>
  <div class="flex h-full grow flex-col">
    <div class="flex h-full grow overflow-y-auto">
      <TheSidebar />
      <div class="flex-grow-1 flex flex-wrap items-start gap-6 p-8">
        <template v-for="(bh, i) in pageItems.get(currentPage)" :key="i">
          <BirdhouseCard :info="bh" />
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
import { useBirdhousesStore } from "@/stores/birdhouses";
const store = useBirdhousesStore();
const { $bhApi } = useNuxtApp();
const config = useRuntimeConfig();

// populate store with info
if ($bhApi !== undefined) {
  store.setItemsPerPage(config.public.cardsPerPage);
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
