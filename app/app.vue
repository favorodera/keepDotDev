<template>
  <UApp :toaster="{ position: 'top-right', progress: false, duration: 4000 }">
    <Analytics />
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator color="white" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt'

useHead({
  htmlAttrs: {
    lang: 'en',
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
  titleTemplate: 'keepdotdev %s',
  description: 'keepdotdev is a platform for creating and sharing your code snippets.',
  ogTitle: 'keepdotdev',
  ogDescription: 'keepdotdev is a platform for creating and sharing your code snippets.',
  ogImage: '/logo.svg',
  ogUrl: 'https://keepdotdev.vercel.app',
  twitterTitle: 'keepdotdev',
  twitterDescription: 'keepdotdev is a platform for creating and sharing your code snippets.',
  twitterImage: '/logo.svg',
  themeColor: '#000000',
  twitterCard: 'summary_large_image',
  ogSiteName: 'keepdotdev',
  twitterSite: '@favorodera',
  twitterCreator: '@favorodera',
})
</script>
