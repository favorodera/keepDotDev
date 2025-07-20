<template>

  <main class="flex flex-col min-h-dvh">

    <LandingPageNav />
    <LandingPageHero />
    <LandingPageFeatures />
    <LandingPageFooter />
    
  </main>
  
</template>

<script lang="ts" setup>
definePageMeta({
  colorMode: 'dark',
})

useSeoMeta({
  title: '| Home',
})
</script>
