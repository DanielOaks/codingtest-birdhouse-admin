<template>
  <div class="flex h-full grow">
    <TheSidebar />
    <div class="flex-grow-1">Test</div>
  </div>
</template>

<script setup lang="ts">
const { $bhApi } = useNuxtApp();

if ($bhApi !== undefined) {
  updateBirdhouses(1);
}

async function updateBirdhouses(page: number) {
  const res = await $bhApi.registration.getRegistrations({
    page,
    limit: 4,
  });
  console.log(res.items[0]?.value);
}
</script>
