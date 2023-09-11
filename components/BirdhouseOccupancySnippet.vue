<template>
  <div :class="`flex text-sm ${extraClasses}`">
    <IconBirdhouse class="mr-2 h-5" :font-controlled="false" />
    <span>{{ props.birds }}</span>
    <IconEgg class="ml-3 mr-1.5 h-5" :font-controlled="false" />
    <span>{{ props.eggs }}</span>
  </div>
</template>

<script setup lang="ts">
import IconBirdhouse from "@/assets/icons/birdhouse.svg";
import IconEgg from "@/assets/icons/egg.svg";

const props = defineProps<{
  extraClasses: string;
  birds: number | undefined;
  eggs: number | undefined;
}>();
</script>
