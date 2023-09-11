<template>
  <div v-if="props.activeTab === props.name" class="h-full">
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ name: string; activeTab: string }>();
</script>
