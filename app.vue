<template>
  <UApp :toaster="{ position: 'top-right', progress: false, duration: 4000 }">
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator color="white" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'en',
    class: 'dark',
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/logo.svg',
    },
    {
      rel: 'canonical',
      href: 'https://keepdotdev.vercel.app',
    },
  ],
})

useSeoMeta({
  titleTemplate: 'Keep.Dev %s',
  description: 'Keep.Dev is a platform for creating and sharing your code snippets.',
  ogTitle: 'Keep.Dev',
  ogDescription: 'Keep.Dev is a platform for creating and sharing your code snippets.',
  ogImage: '/logo.svg',
  ogUrl: 'https://keepdotdev.vercel.app',
  twitterTitle: 'Keep.Dev',
  twitterDescription: 'Keep.Dev is a platform for creating and sharing your code snippets.',
  twitterImage: '/logo.svg',
  themeColor: '#000000',
  twitterCard: 'summary_large_image',
  ogSiteName: 'Keep.Dev',
  twitterSite: '@favorodera',
  twitterCreator: '@favorodera',
})
</script>
