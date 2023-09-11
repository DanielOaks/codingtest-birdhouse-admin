<template>
  <div class="flex h-full grow flex-col">
    <div class="flex h-full grow">
      <TheSidebar />
      <div
        class="flex-grow-1 flex w-full flex-col items-stretch overflow-y-auto p-8"
      >
        <div class="rounded-xl bg-sbgrey-400 p-5">
          <div class="flex justify-between">
            <h2 class="mb-3 text-xl font-semibold">{{ bh.birdhouse?.name }}</h2>
            <BirdhouseCardLocation
              extra-classes="mt-1"
              :latitude="bh.birdhouse?.latitude"
              :longitude="bh.birdhouse?.longitude"
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

useHead({
  title: bh.value.birdhouse?.name,
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
}

populate();
</script>
