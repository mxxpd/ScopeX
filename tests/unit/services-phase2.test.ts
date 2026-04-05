import { describe, expect, it } from 'vitest'
import { calculateOwnRateResult, calculateMarketResult } from '~/utils/market-pricing'
import { buildServiceBreakdown, calculateTotalHours } from '~/utils/services'

describe('phase 2 service constructor calculations', () => {
  it('calculates total hours including screen-based modifiers', () => {
    const hours = calculateTotalHours(['screenDesign', 'adaptive', 'darkMode'], 5, 1)

    expect(hours).toEqual({
      min: 22,
      max: 44,
      mid: 33,
    })
  })

  it('builds per-service breakdown with grouped hours and rounded prices', () => {
    const breakdown = buildServiceBreakdown({
      selectedIds: ['screenDesign', 'adaptive', 'revisions'],
      screensCount: 4,
      revisionsCount: 2,
    }, 2000)

    expect(breakdown).toEqual([
      {
        id: 'screenDesign',
        group: 'ui',
        groupLabel: 'UI дизайн',
        label: 'Дизайн экранов',
        hoursMin: 12,
        hoursMax: 24,
        price: 36000,
      },
      {
        id: 'adaptive',
        group: 'ui',
        groupLabel: 'UI дизайн',
        label: 'Адаптивная версия',
        hoursMin: 3,
        hoursMax: 6,
        price: 10000,
      },
      {
        id: 'revisions',
        group: 'delivery',
        groupLabel: 'Документация и сдача',
        label: 'Правки',
        hoursMin: 4,
        hoursMax: 8,
        price: 12000,
      },
    ])
  })

  it('returns market and own-rate summaries with recommended ranges', () => {
    const market = calculateMarketResult({
      grade: 'middle',
      buffer: 20,
      services: {
        selectedIds: ['briefing', 'screenDesign'],
        screensCount: 3,
        revisionsCount: 1,
      },
    })

    expect(market.totalHoursMin).toBe(11)
    expect(market.totalHoursMax).toBe(22)
    expect(market.adjustedHoursMin).toBe(13)
    expect(market.adjustedHoursMax).toBe(26)
    expect(market.buffer).toBe(20)
    expect(market.recommendedMin).toBe(47000)
    expect(market.recommendedMax).toBe(63000)

    const ownRate = calculateOwnRateResult({
      hourlyRate: 2500,
      buffer: 20,
      services: {
        selectedIds: ['briefing', 'screenDesign'],
        screensCount: 3,
        revisionsCount: 1,
      },
    })

    expect(ownRate.hourlyRate).toBe(2500)
    expect(ownRate.buffer).toBe(20)
    expect(ownRate.adjustedHoursMin).toBe(13)
    expect(ownRate.adjustedHoursMax).toBe(26)
    expect(ownRate.price).toBe(50000)
  })
})
