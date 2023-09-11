<template>
  <div class="flex items-center text-lg">
    <IconPrev
      :class="{
        'h-12 cursor-pointer px-1 py-3 text-transparent': true,
        invisible: currentItem <= 1,
      }"
      :font-controlled="false"
      @click.prevent="changeTo(currentItem - 1)"
    />
    <a
      v-if="currentItem > 1"
      class="non-active cursor-pointer pl-3 pr-4"
      @click.prevent="changeTo(1)"
      v-text="1"
    />
    <span v-if="currentItem > 3" class="non-active block select-none pr-1">
      ...
    </span>
    <a
      v-if="currentItem > 2"
      class="non-active cursor-pointer pl-4 pr-3"
      @click.prevent="changeTo(currentItem - 1)"
      v-text="currentItem - 1"
    />
    <span
      class="my-3 block select-none rounded bg-sbpurple px-3.5 py-0.5"
      v-text="currentItem"
    />
    <a
      v-if="currentItem < totalItems - 1"
      class="non-active cursor-pointer pl-4 pr-3"
      @click.prevent="changeTo(currentItem + 1)"
      v-text="currentItem + 1"
    />
    <span
      v-if="currentItem < totalItems - 2"
      class="non-active block select-none pl-1"
    >
      ...
    </span>
    <a
      v-if="currentItem < totalItems"
      class="non-active cursor-pointer pl-4 pr-3"
      @click.prevent="changeTo(totalItems)"
      v-text="totalItems"
    />
    <IconNext
      :class="{
        'h-12 cursor-pointer px-1 py-3 text-transparent': true,
        invisible: currentItem >= totalItems,
      }"
      :font-controlled="false"
      @click.prevent="changeTo(currentItem + 1)"
    />
  </div>
</template>

<script setup lang="ts">
// Note: the above may look a bit messy, but each element does its job and
//  we're checking whether each should be displayed or not. the left and right
//  padding differs on each so they look nice in different combinations.

import IconPrev from "@/assets/icons/chevron-left.svg";
import IconNext from "@/assets/icons/chevron-right.svg";

const emit = defineEmits<{
  (e: "selectItem", item: number): void;
}>();

const props = defineProps<{ totalItems: number; currentItem: number }>();

const { totalItems, currentItem } = toRefs(props);

function changeTo(item: number) {
  if (item > 0 && item <= props.totalItems) {
    emit("selectItem", item);
  }
}
</script>

<style scoped>
.non-active {
  @apply opacity-40;
}
</style>
