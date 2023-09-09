<template>
  <NuxtLink :href="props.href" class="sidebar-button-link">
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps({
  href: {
    type: String,
    default: "#",
  },
});
</script>

<style>
.sidebar-button-link {
  @apply mt-4 rounded-xl p-3 text-transparent opacity-20 transition-all;
}
.sidebar-button-link:hover,
.sidebar-button-link.router-link-exact-active {
  @apply bg-sbpurple opacity-100;
}
</style>
