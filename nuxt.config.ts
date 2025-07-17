// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  extends: ['@favorodera/nuxt-helper'],
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@nuxtjs/supabase',
    'nuxt-monaco-editor',
    '@vueuse/nuxt',
  ],
  ssr: true,
  imports: {
    dirs: ['utils/**', 'stores/**'],
  },
  devtools: { enabled: false },
  app: {
    rootTag: 'main',
    rootAttrs: {
      id: 'app',
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
    
  },
  css: ['~/assets/css/main.css', '~/assets/css/markdown.css'],
  runtimeConfig: {
    googleGenerativeAiKey: '',
  },
  routeRules: {
    '/': { prerender: true },
    '/auth': { prerender: true },
    '/read/**': { isr: 3600 },
  },
  compatibilityDate: '2025-07-15',
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
  icon: {
    customCollections: [{
      prefix: 'custom',
      dir: './app/assets/icons',
    }],
  },
  supabase: {
    url: process.env.NUXT_PUBLIC_SUPABASE_URL,
    key: process.env.NUXT_PUBLIC_SUPABASE_KEY,
    serviceKey: process.env.NUXT_SUPABASE_SERVICE_KEY,
    redirectOptions: {
      login: '/auth',
      callback: '/auth/confirm',
      include: ['/library/**'],
      exclude: ['/'],
      saveRedirectToCookie: true,
    },
    cookiePrefix: 'keepdotdev-auth-token',
  },
})
