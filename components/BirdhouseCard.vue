<template>
  <div :class="{
    'rounded-xl bg-sbgrey-400 p-5': true,
    'cursor-pointer': hasBirdhouse,
  }">
    <template v-if="hasBirdhouse && props.info.birdhouse">
      <h2 class="mb-4 text-xl font-semibold" v-text="props.info.birdhouse.name" />
      <BirdhouseLocationSnippet extra-classes="mb-2.5" :latitude="props.info.birdhouse?.latitude"
        :longitude="props.info.birdhouse?.longitude" />
      <BirdhouseOccupancySnippet v-if="$config.public.loadOccupancyDetailsOnList" extra-classes=""
        :birds="props.info.birdhouse?.currentOccupancy?.birds" :eggs="props.info.birdhouse?.currentOccupancy?.eggs" />
    </template>
    <span v-if="!hasBirdhouse">
      <h2 class="mb-1 text-xl font-semibold">
        No birdhouse
      </h2>
      <span class="text-sm opacity-70">
        This registration does not<br>have a birdhouse.
      </span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { Registration, NullRegistration } from "@/stores/birdhouses";

const props = defineProps<{ info: Registration }>();

const hasBirdhouse = computed(() => {
  return !(props.info === NullRegistration || props.info.birdhouse === undefined)
})
</script>
