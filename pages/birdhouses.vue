<template>
  <div class="flex h-full grow">
    <TheSidebar />
    <div class="flex-grow-1 flex flex-wrap items-start p-8">
      <template v-for="(bh, i) in pageItems.get(1)" :key="i">
        <div v-if="bh.birdhouse" class="mb-6 mr-6 rounded-xl bg-sbgrey-400 p-5">
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
}

const { pageItems, birdhouseInfo } = storeToRefs(store);
</script>
