import { defineStore } from 'pinia'
import type { FormData } from '~/types'
import {
  calculateCalculatorState,
  clearCalculatorState,
  setCalculatorForm,
} from '~/utils/calculator-state'

export const useCalculatorStore = defineStore('calculator', () => {
  const session = useCalculatorSession()
  const formData = session.formData
  const result = session.result

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

  function reset() {
    const emptyState = clearCalculatorState()
    session.persistForm(emptyState.formData)
    session.persistResult(emptyState.result)
  }

  return { formData, result, setForm, calculate, reset }
})
