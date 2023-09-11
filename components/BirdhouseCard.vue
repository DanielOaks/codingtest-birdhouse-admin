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
import { Registration } from "@/stores/birdhouses";
import IconBirdhouse from "@/assets/icons/birdhouse.svg";
import IconEgg from "@/assets/icons/egg.svg";

const props = defineProps<{ info: Registration }>();
</script>
