// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: ["nuxt-svgo", "@pinia/nuxt"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  runtimeConfig: {
    // private, only available server-side

    // public, exposed client-side
    public: {
      // note, increasing this value means more occupancy requests on each page load.
      // to avoid this, disable loadOccupancyDetailsOnList
      cardsPerPage: 4,
      occupancyUpdatesToGrab: 10,
      apiBase: "http://localhost:3000/",
    },
  },
});
