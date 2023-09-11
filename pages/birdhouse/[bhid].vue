<template>
  <div class="flex h-full grow flex-col">
    <div class="flex h-full grow">
      <TheSidebar />
      <div class="flex-grow-1 flex flex-col overflow-y-auto p-8">
        <div class="rounded-xl bg-sbgrey-400 p-5">
          <div class="flex">
            <h2
              class="mb-4 text-xl font-semibold"
              v-text="bh.birdhouse?.name"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-shrink-0 items-center justify-center bg-sbgrey-400">
      <AppPaginator :total-items="1" :current-item="1" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBirdhousesStore, NullRegistration } from "@/stores/birdhouses";
const store = useBirdhousesStore();
const { $bhApi } = useNuxtApp();
const config = useRuntimeConfig();

const route = useRoute();

const bh = ref(NullRegistration);

// populate store with info
if ($bhApi !== undefined) {
  store.setConfig({
    occupancyUpdatesToGrab: config.public.occupancyUpdatesToGrab,
  });
  bh.value = await store.getBirdhouseInfo(route.params.bhid.toString());
  console.log("bh value is", bh.value.value);
}
</script>
