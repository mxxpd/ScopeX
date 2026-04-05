import { defineStore } from 'pinia'
import type { FormData, ModeResult } from '~/types'
import {
  calculateCalculatorState,
  clearCalculatorState,
  setCalculatorForm,
} from '~/utils/calculator-state'

export const useCalculatorStore = defineStore('calculator', () => {
  const session = useCalculatorSession()
  const formData = session.formData
  const result = session.result

  // Mode-specific state (in-memory only; mode selection persists via localStorage in the page)
  const modeResult = ref<ModeResult | null>(null)

  function setForm(data: FormData) {
    const nextState = setCalculatorForm({
      formData: formData.value,
      result: result.value,
    }, data)

    session.persistForm(nextState.formData)
    session.persistResult(nextState.result)
  }

  function calculate() {
    const nextState = calculateCalculatorState({
      formData: formData.value,
      result: result.value,
    })

    session.persistForm(nextState.formData)
    session.persistResult(nextState.result)
  }

  function setModeResult(data: ModeResult) {
    modeResult.value = data
    // Clear old-style result so middleware routes to new mode view
    session.persistResult(null)
  }

  function reset() {
    const emptyState = clearCalculatorState()
    session.persistForm(emptyState.formData)
    session.persistResult(emptyState.result)
    modeResult.value = null
  }

  return { formData, result, modeResult, setForm, calculate, setModeResult, reset }
})
