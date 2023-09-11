<template>
  <div
    class="tab-button"
    :class="props.activeTab === props.name ? 'active' : ''"
    @click.prevent="emit('click', props.name)"
  >
    {{ props.name }}
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ name: string; activeTab: string }>();
const emit = defineEmits<{
  (e: "click", name: string): void;
}>();
</script>

<style scoped>
.tab-button {
  @apply cursor-pointer py-2.5 text-white opacity-40 transition-all;
}

.tab-button + .tab-button {
  @apply ml-8;
}

.tab-button:hover,
.tab-button.active {
  @apply border-b border-sbpurple py-2.5 text-sbpurple opacity-100;
}
</style>
