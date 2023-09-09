/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        sbpurple: "#5051F9",
        sbgrey: {
          100: "#131517",
          400: "#1E1F25",
        },
        graphpurple: "#744F99",
        graphblue: "#0E9CFF",
      },
    },
  },
  plugins: [],
};
