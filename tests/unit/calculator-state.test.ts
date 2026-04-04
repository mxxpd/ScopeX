import { describe, expect, it } from 'vitest'
import type { FormData } from '~/types'
import {
  calculateCalculatorState,
  clearCalculatorState,
  cloneFormData,
  createEmptyCalculatorState,
  hasCalculationResult,
  setCalculatorForm,
} from '~/utils/calculator-state'

function createForm(overrides: Partial<FormData> = {}): FormData {
  return {
    projectType: 'landing',
    scopeValue: 6,
    complexity: 'standard',
    revisions: 2,
    addons: {
      research: false,
      prototype: false,
      designSystem: false,
      adaptive: true,
      copywriting: false,
      devHandoff: false,
      urgent: false,
    },
    ...overrides,
  }
}

describe('calculator state transitions', () => {
  it('deep clones form data so nested addons stay isolated', () => {
    const original = createForm()
    const cloned = cloneFormData(original)

    cloned.addons.adaptive = false

    expect(original.addons.adaptive).toBe(true)
  })

  it('resets stale result when a new form is applied', () => {
    const calculatedState = calculateCalculatorState(
      setCalculatorForm(createEmptyCalculatorState(), createForm()),
    )

    const nextState = setCalculatorForm(
      calculatedState,
      createForm({ projectType: 'corporate' }),
    )

    expect(nextState.formData?.projectType).toBe('corporate')
    expect(nextState.result).toBeNull()
  })

  it('builds a result when the current state has form data', () => {
    const nextState = calculateCalculatorState(
      setCalculatorForm(createEmptyCalculatorState(), createForm()),
    )

    expect(hasCalculationResult(nextState.result)).toBe(true)
    expect(nextState.result?.finalPrice).toBeGreaterThan(0)
  })

  it('clears the whole calculator state snapshot', () => {
    expect(clearCalculatorState()).toEqual({
      formData: null,
      result: null,
    })
  })
})
