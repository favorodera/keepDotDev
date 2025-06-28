// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  extends: ['@favorodera/nuxt-helper'],
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxtjs/supabase',
  ],
  ssr: true,
  imports: {
    dirs: ['utils/types'],
  },
  devtools: { enabled: true },
  app: {
    rootTag: 'main',
    rootAttrs: {
      id: 'app',
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },
  css: ['~/assets/css/main.css'],
  experimental: {
    defaults: {
      useAsyncData: {
        deep: true,
        value: undefined,
        errorValue: undefined,
      },
    },
  },
  compatibilityDate: '2025-05-15',
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
  supabase: {
    url: process.env.NUXT_PUBLIC_SUPABASE_URL,
    key: process.env.NUXT_PUBLIC_SUPABASE_KEY,
    serviceKey: process.env.NUXT_SUPABASE_SERVICE_KEY,
    redirectOptions: {
      login: '/auth',
      callback: '/auth/confirm',
      include: ['/shelf'],
      exclude: ['/'],
      saveRedirectToCookie: true,
    },
    cookiePrefix: 'keepdotdev-auth-token',
  },
})
