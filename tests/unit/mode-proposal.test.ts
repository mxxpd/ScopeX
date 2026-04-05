import { describe, expect, it } from 'vitest'
import { calculateMarketResult, calculateOwnRateResult } from '~/utils/market-pricing'
import { generateModeProposal } from '~/utils/mode-proposal'
import type { ProposalMode } from '~/types'

describe('generateModeProposal', () => {
  const marketResult = calculateMarketResult({
    grade: 'middle',
    buffer: 20,
    services: {
      selectedIds: ['briefing', 'screenDesign', 'adaptive'],
      screensCount: 3,
      revisionsCount: 1,
    },
  })

  const ownRateResult = calculateOwnRateResult({
    hourlyRate: 2500,
    buffer: 20,
    services: {
      selectedIds: ['briefing', 'screenDesign', 'adaptive'],
      screensCount: 3,
      revisionsCount: 1,
    },
  })

  it.each<ProposalMode>(['short', 'standard', 'extended'])(
    'builds %s proposal text for market mode',
    (mode) => {
      const text = generateModeProposal(marketResult, mode)

      expect(text).toContain('Рассчитано в ScopeX')
      if (mode !== 'short') {
        expect(text).toContain('Дизайн экранов')
      }
    },
  )

  it('includes service breakdown and hourly rate for own-rate mode', () => {
    const text = generateModeProposal(ownRateResult, 'standard')

    expect(text).toContain('2')
    expect(text).toContain('500 ₽/ч')
    expect(text).toContain('Брифинг и анализ ТЗ')
    expect(text).toContain('Адаптивная версия')
  })

  it('explains value by blocks in extended mode', () => {
    const text = generateModeProposal(marketResult, 'extended')

    expect(text).toContain('Почему смета собрана именно так')
    expect(text).toContain('Этот блок помогает зафиксировать задачу')
    expect(text).toContain('Этот блок отвечает за финальный визуал')
  })
})
