import API from "@danieloaks/codingtest-birdhouse-js";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const api = new API({
    apiBase: config.public.apiBase,
  });

  return {
    provide: {
      bhApi: api,
    },
  };
});
