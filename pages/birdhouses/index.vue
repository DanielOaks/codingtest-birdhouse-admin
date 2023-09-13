<template>
  <div class="flex h-full grow flex-col">
    <div class="flex h-full grow">
      <TheSidebar />
      <div
        class="flex-grow-1 flex flex-wrap content-start items-start gap-6 overflow-y-auto p-8"
      >
        <template
          v-for="(bh, i) in registrationPageItems.get(
            currentRegistrationListPage,
          )"
          :key="i"
        >
          <BirdhouseCard
            :info="registrationInfo.get(bh) || NullRegistration"
            @click.prevent="
              registrationInfo.get(bh)?.birdhouse
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
        :total-items="totalRegistrationPages"
        :current-item="currentRegistrationListPage"
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

const {
  currentRegistrationListPage,
  totalRegistrationPages,
  registrationPageItems,
  registrationInfo,
} = storeToRefs(store);

async function changeToPage(newPage: number, pushState?: boolean) {
  // load new information
  loading.value = true;
  await store.setRegistrationPage(
    $bhApi,
    newPage,
    config.public.loadOccupancyDetailsOnList,
  );
  loading.value = false;

  // update page url
  if (pushState === undefined || pushState === true) {
    useRouter().push({
      query: {
        page: newPage,
      },
    });
  }
}

// respond to page changes from back/forward browser buttons
usePopStatePage((newPage) => {
  changeToPage(newPage, false);
});

// populate store with initial info
async function populate() {
  if ($bhApi !== undefined) {
    store.setConfig({
      registrationItemsPerPage: config.public.registrationItemsPerPage,
    });

    const initialPage = useInitialPageNumber();
    await store.setRegistrationPage(
      $bhApi,
      initialPage,
      config.public.loadOccupancyDetailsOnList,
    );
  }
  loading.value = false;
}

populate();
</script>
