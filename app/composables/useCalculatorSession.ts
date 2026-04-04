import type { CalculationResult, FormData } from '~/types'
import {
  clearCalculatorState,
  createEmptyCalculatorState,
} from '~/utils/calculator-state'

export function useCalculatorSession() {
  const formCookie = useCookie<FormData | null>('scopex-form', {
    default: () => null,
    sameSite: 'lax',
  })
  const resultCookie = useCookie<CalculationResult | null>('scopex-result', {
    default: () => null,
    sameSite: 'lax',
  })

  const fallbackState = createEmptyCalculatorState()
  const formData = ref<FormData | null>(formCookie.value ?? fallbackState.formData)
  const result = ref<CalculationResult | null>(resultCookie.value ?? fallbackState.result)

  function persistForm(value: FormData | null) {
    formData.value = value
    formCookie.value = value
  }

  function persistResult(value: CalculationResult | null) {
    result.value = value
    resultCookie.value = value
  }

  function clear() {
    const emptyState = clearCalculatorState()
    persistForm(emptyState.formData)
    persistResult(emptyState.result)
  }

  return {
    formData,
    result,
    persistForm,
    persistResult,
    clear,
  }
}
