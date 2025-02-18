// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@unocss/nuxt', '@nuxt/eslint', '@nuxt/icon', '@vueuse/nuxt', '@nuxt/image'],
  icon: {
    clientBundle: {
      scan: true,
    },
    serverBundle: {
      disabled: true,
    },
    fallbackToApi: false,
  },
  css: ['~/assets/css/main.css'],
  unocss: {
    preflight: true,
  },
  nitro: {
    routeRules: {
      '/_ipx/**': {
        cache: { maxAge: 0 },
      },
    },
    serveStatic: 'node',
  },
  eslint: {
    config: {
      standalone: false,
    },
  },
  runtimeConfig: {
    DOMAIN: 'https://onlylovesnow14.synology.me:8888',
  },
})
