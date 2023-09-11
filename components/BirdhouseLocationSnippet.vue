<template>
  <div :class="`flex text-sm ${props.extraClasses}`">
    <IconLocationMarker class="mr-2.5 h-5" :font-controlled="false" />
    <span v-text="`(${props.latitude}, ${props.longitude})`" />
  </div>
</template>

<script setup lang="ts">
import IconLocationMarker from "@/assets/icons/location-marker.svg";

const props = defineProps<{
  extraClasses: string;
  latitude: number | undefined;
  longitude: number | undefined;
}>();
</script>
