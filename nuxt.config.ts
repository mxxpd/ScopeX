// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt',
  ],
  components: [
    { path: '~/components/calculator', pathPrefix: false },
    { path: '~/components/ui', pathPrefix: false },
    '~/components',
  ],
  app: {
    head: {
      title: 'ScopeX — рассчитай стоимость дизайна',
      meta: [
        { name: 'description', content: 'Инструмент для дизайнеров: быстро рассчитай стоимость проекта и получи готовый текст для клиента' },
      ],
    },
  },
})
