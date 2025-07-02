<template>

  <main class="flex flex-col min-h-screen">
  
    <AuthNav />
    <AuthConfirmCard />
    <LandingPageFooter />
  
  </main>
  
</template>

<script lang="ts" setup>
definePageMeta({
  colorMode: 'dark',
})

useSeoMeta({
  title: '| Confirm Login',
  description: 'Confirm your login',
})
</script>
  
