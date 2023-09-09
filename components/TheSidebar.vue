<template>
  <div class="flex flex-grow-0 flex-col bg-sbgrey-400 px-3">
    <TheSidebarButton href="/">
      <IconHome class="h-6" :font-controlled="false" />
    </TheSidebarButton>
    <TheSidebarButton href="/birdhouses">
      <IconGridView class="h-6" :font-controlled="false" />
    </TheSidebarButton>
  </div>
</template>

<script setup lang="ts">
import IconHome from "@/assets/icons/home.svg";
import IconGridView from "@/assets/icons/view-grid.svg";
</script>
