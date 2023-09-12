<template>
  <div class="flex flex-grow flex-col items-center justify-center">
    <h1 class="mb-7 text-2xl font-semibold">Home page</h1>
    <NuxtLink
      to="/birdhouses"
      class="flex rounded-lg bg-sbpurple py-3 pl-5 pr-4"
    >
      To BirdHouses Overview
      <IconArrowRight class="ml-2 inline-block h-6" :font-controlled="false" />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import IconArrowRight from "@/assets/icons/arrow-right.svg";

useHead({
  title: "",
});
</script>
