<template>
  <div v-if="props.activeTab === props.name">
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ name: string; activeTab: string }>();
</script>
