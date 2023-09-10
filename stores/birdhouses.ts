import { defineStore, acceptHMRUpdate } from "pinia";

export const useBhStore = defineStore("birdhouses", () => {});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBhStore, import.meta.hot));
}
