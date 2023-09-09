<template>
  <div class="flex flex-grow flex-col items-center justify-center">
    <h1 class="mb-7 text-2xl font-semibold">Home page</h1>
    <NuxtLink
      to="/birdhouses"
      class="rounded-lg bg-sbpurple pl-5 pr-4 py-3 flex"
    >
      To BirdHouses Overview
      <IconArrowRight class="inline-block ml-2 h-6" :font-controlled="false" />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import IconArrowRight from "@/assets/icons/arrow-right.svg";
</script>
