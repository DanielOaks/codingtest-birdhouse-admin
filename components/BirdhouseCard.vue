<template>
  <div
    :class="{
      'rounded-xl bg-sbgrey-400 p-5': true,
      'cursor-pointer': props.info.birdhouse,
    }"
  >
    <template v-if="props.info.birdhouse">
      <h2
        class="mb-4 text-xl font-semibold"
        v-text="props.info.birdhouse.name"
      />
      <BirdhouseCardLocation
        extra-classes="mb-2.5"
        :latitude="props.info.birdhouse?.latitude"
        :longitude="props.info.birdhouse?.longitude"
      />
      <BirdhouseCardOccupancy
        v-if="$config.public.loadOccupancyDetailsOnList"
        extra-classes=""
        :birds="props.info.birdhouse?.currentOccupancy?.birds"
        :eggs="props.info.birdhouse?.currentOccupancy?.eggs"
      />
    </template>
    <span v-if="!props.info.birdhouse"> Unregistered </span>
  </div>
</template>

<script setup lang="ts">
import { Registration } from "@/stores/birdhouses";

const props = defineProps<{ info: Registration }>();
</script>
