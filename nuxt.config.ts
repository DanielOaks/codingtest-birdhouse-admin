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
      // base values
      apiBase: "http://localhost:3000/",

      // registration values
      // note, increasing this means extra API requests on each page load.
      // to avoid this, disable loadOccupancyDetailsOnList
      registrationItemsPerPage: 4,
      loadOccupancyDetailsOnList: true,

      occupancyStatesPerPage: 10,
    },
  },
});
