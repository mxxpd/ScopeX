import { calculateResult } from '~/utils/pricing'
import type { CalculationResult, FormData } from '~/types'

export interface CalculatorStateSnapshot {
  formData: FormData | null
  result: CalculationResult | null
}

export function cloneFormData(data: FormData): FormData {
  return {
    projectType: data.projectType,
    scopeValue: data.scopeValue,
    complexity: data.complexity,
    revisions: data.revisions,
    addons: {
      research: data.addons.research,
      prototype: data.addons.prototype,
      designSystem: data.addons.designSystem,
      adaptive: data.addons.adaptive,
      copywriting: data.addons.copywriting,
      devHandoff: data.addons.devHandoff,
      urgent: data.addons.urgent,
    },
  }
}

export function createEmptyCalculatorState(): CalculatorStateSnapshot {
  return {
    formData: null,
    result: null,
  }
}

export function setCalculatorForm(
  state: CalculatorStateSnapshot,
  data: FormData,
): CalculatorStateSnapshot {
  return {
    ...state,
    formData: cloneFormData(data),
    result: null,
  }
}

export function calculateCalculatorState(
  state: CalculatorStateSnapshot,
): CalculatorStateSnapshot {
  if (!state.formData) {
    return state
  }

  const formData = cloneFormData(state.formData)

  return {
    formData,
    result: calculateResult(formData),
  }
}

export function clearCalculatorState(): CalculatorStateSnapshot {
  return createEmptyCalculatorState()
}

export function hasCalculationResult(
  result: CalculationResult | null,
): result is CalculationResult {
  return result !== null
}
