<template>

  <main>

    <LandingPageNav />
    <LandingPageHero />
    <LandingPageFeatures />
    
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
