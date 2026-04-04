import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  ignores: [
    '.nuxt/**',
    'components/**',
    'composables/**',
    'middleware/**',
    'stores/**',
    'types/**',
    'utils/**',
  ],
  rules: {
    'vue/no-multiple-template-root': 'off',
    'vue/no-v-html': 'off',
    'vue/multi-word-component-names': 'off',
  },
})
