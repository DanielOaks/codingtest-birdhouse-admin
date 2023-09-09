<template>
  <div>
    <Head>
      <Link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <Link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <Link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <Link rel="manifest" href="/site.webmanifest" />
      <Link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      <Meta name="msapplication-TileColor" content="#1f1f1f" />
      <Meta name="theme-color" content="#111111" />
    </Head>

    <Body class="bg-sbgrey-100 text-white">
      <div class="flex min-h-screen w-screen flex-col">
        <div
          class="flex-grow-0 bg-sbgrey-400 py-5 text-center font-['Inter'] text-xl font-bold tracking-[.02em]"
        >
          Shockbyte BirdHouses Admin Panel
        </div>
        <slot />
      </div>
    </Body>
  </div>
</template>

<script setup lang="ts">
import "@fontsource/poppins";
import "@fontsource/inter/700.css";

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk
      ? `${titleChunk} - Shockbyte BirdHouses Admin`
      : "Shockbyte BirdHouses Admin";
  },
});
</script>
