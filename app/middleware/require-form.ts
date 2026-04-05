import { hasCalculationResult } from '~/utils/calculator-state'

export default defineNuxtRouteMiddleware(() => {
  const store = useCalculatorStore()
  if (!hasCalculationResult(store.result) && !store.modeResult) {
    return navigateTo('/calculator')
  }
})
