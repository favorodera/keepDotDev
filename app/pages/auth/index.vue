<template>

  <main class="flex flex-col min-h-screen">

    <AuthNav />
    <AuthInCard />
    <LandingPageFooter />

  </main>

</template>

<script lang="ts" setup>
definePageMeta({
  colorMode: 'dark',
})

useSeoMeta({
  title: '| Authentication',
})
</script>
