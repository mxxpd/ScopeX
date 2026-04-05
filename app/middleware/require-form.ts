export default defineNuxtRouteMiddleware(() => {
  const store = useCalculatorStore()
  if (!store.modeResult) {
    return navigateTo('/calculator')
  }
})
