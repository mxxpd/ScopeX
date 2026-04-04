import { describe, expect, it } from 'vitest'
import { hasCalculationResult } from '~/utils/calculator-state'
import { calculateResult } from '~/utils/pricing'
import type { FormData } from '~/types'

const formData: FormData = {
  projectType: 'landing',
  scopeValue: 7,
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
}

describe('hasCalculationResult', () => {
  it('returns false when result is empty', () => {
    expect(hasCalculationResult(null)).toBe(false)
  })

  it('returns true when calculation result exists', () => {
    const result = calculateResult(formData)

    expect(hasCalculationResult(result)).toBe(true)
  })
})
