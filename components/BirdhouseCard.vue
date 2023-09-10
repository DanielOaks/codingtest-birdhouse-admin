<template>
  <div class="rounded-xl bg-sbgrey-400 p-5">
    <template v-if="props.info.birdhouse">
      <h2
        class="mb-4 text-xl font-semibold"
        v-text="props.info.birdhouse.name"
      />
      <div class="mb-2.5 flex text-sm">
        <IconLocationMarker class="mr-2.5 h-5" :font-controlled="false" />
        <span
          v-text="
            `(${props.info.birdhouse.latitude}, ${props.info.birdhouse.longitude})`
          "
        />
      </div>
      <div class="flex text-sm">
        <IconBirdhouse class="mr-2 h-5" :font-controlled="false" />
        <span v-text="0" />
        <IconEgg class="ml-3 mr-1.5 h-5" :font-controlled="false" />
        <span v-text="0" />
      </div>
    </template>
    <span v-if="!props.info.birdhouse"> Unregistered </span>
  </div>
</template>

<script setup lang="ts">
import { Registration } from "@danieloaks/codingtest-birdhouse-js/dist/module/registration";
import IconLocationMarker from "@/assets/icons/location-marker.svg";
import IconBirdhouse from "@/assets/icons/birdhouse.svg";
import IconEgg from "@/assets/icons/egg.svg";

const props = defineProps<{ info: Registration }>();
</script>
