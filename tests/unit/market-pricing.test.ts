import { describe, expect, it } from 'vitest'
import {
  calculateMarketResult,
  calculateOwnRateResult,
  calculateSelfCheckResult,
} from '~/utils/market-pricing'

describe('mode pricing calculations', () => {
  it('calculates market mode with selected grade and buffer', () => {
    const result = calculateMarketResult({
      grade: 'middle',
      buffer: 20,
      services: {
        selectedIds: ['briefing', 'screenDesign'],
        screensCount: 3,
        revisionsCount: 1,
      },
    })

    expect(result.mode).toBe('market')
    expect(result.selectedGrade).toBe('middle')
    expect(result.buffer).toBe(20)
    expect(result.adjustedHoursMin).toBeGreaterThan(result.totalHoursMin)
    expect(result.middle.mid).toBe(55000)
    expect(result.recommendedMin).toBe(47000)
    expect(result.recommendedMax).toBe(63000)
  })

  it('calculates own-rate mode with market comparison', () => {
    const result = calculateOwnRateResult({
      hourlyRate: 2500,
      buffer: 20,
      services: {
        selectedIds: ['briefing', 'screenDesign'],
        screensCount: 3,
        revisionsCount: 1,
      },
    })

    expect(result.mode).toBe('own-rate')
    expect(result.buffer).toBe(20)
    expect(result.price).toBe(50000)
    expect(result.market.min).toBeGreaterThan(0)
    expect(['below', 'in', 'above']).toContain(result.marketPosition)
  })

  it('calculates self-check mode against middle market range', () => {
    const result = calculateSelfCheckResult({
      quotedPrice: 80000,
      projectType: 'landing',
      scopeValue: 7,
    })

    expect(result.mode).toBe('self-check')
    expect(result.market.min).toBeGreaterThan(0)
    expect(result.market.max).toBeGreaterThan(result.market.min)
    expect(result.positionPercent).toBeGreaterThanOrEqual(0)
    expect(result.positionPercent).toBeLessThanOrEqual(100)
  })
})
