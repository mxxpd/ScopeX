import { describe, expect, it } from 'vitest'
import { calculateResult, formatPrice } from '~/utils/pricing'
import type { FormData } from '~/types'

function createForm(overrides: Partial<FormData> = {}): FormData {
  return {
    projectType: 'landing',
    scopeValue: 5,
    complexity: 'standard',
    revisions: 2,
    addons: {
      research: false,
      prototype: false,
      designSystem: false,
      adaptive: false,
      copywriting: false,
      devHandoff: false,
      urgent: false,
    },
    ...overrides,
  }
}

describe('calculateResult', () => {
  it('applies the project minimum when subtotal is too low', () => {
    const result = calculateResult(createForm())

    expect(result.finalPrice).toBe(35000)
    expect(result.minPrice).toBe(30000)
    expect(result.maxPrice).toBe(40000)
    expect(result.weeks).toEqual({ min: 2, max: 4 })
    expect(result.breakdown).toHaveLength(2)
  })

  it('adds optional services and urgent markup to the breakdown', () => {
    const result = calculateResult(createForm({
      projectType: 'corporate',
      scopeValue: 10,
      complexity: 'advanced',
      revisions: 3,
      addons: {
        research: true,
        prototype: true,
        designSystem: false,
        adaptive: true,
        copywriting: false,
        devHandoff: true,
        urgent: true,
      },
    }))

    expect(result.finalPrice).toBe(131000)
    expect(result.weeks).toEqual({ min: 3, max: 6 })
    expect(result.breakdown.at(-1)?.amount).toBe(43500)
  })
})

describe('formatPrice', () => {
  it('formats prices using the Russian locale', () => {
    expect(formatPrice(125000).replace(/\s/g, ' ')).toContain('125 000')
  })
})
