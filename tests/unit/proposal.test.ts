import { describe, expect, it } from 'vitest'
import { generateProposal } from '~/utils/proposal'
import { calculateResult } from '~/utils/pricing'
import type { FormData, ProposalMode } from '~/types'

const formData: FormData = {
  projectType: 'landing',
  scopeValue: 8,
  complexity: 'standard',
  revisions: 2,
  addons: {
    research: false,
    prototype: true,
    designSystem: false,
    adaptive: true,
    copywriting: false,
    devHandoff: false,
    urgent: false,
  },
}

describe('generateProposal', () => {
  it.each<ProposalMode>(['short', 'standard', 'extended'])(
    'builds the %s proposal with key project details',
    (mode) => {
      const result = calculateResult(formData)
      const proposal = generateProposal(result, mode)

      expect(proposal).toContain('ScopeX')
      expect(proposal).toContain('35')
      expect(proposal).toContain('3')
      expect(proposal).toContain('5')
    },
  )

  it('mentions active add-ons in the short version', () => {
    const result = calculateResult(formData)
    const proposal = generateProposal(result, 'short')

    expect(proposal).toContain('прототип')
    expect(proposal).toContain('адаптив')
  })
})
