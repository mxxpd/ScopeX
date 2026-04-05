import { defineStore } from 'pinia'
import type { ModeResult } from '~/types'

export const useCalculatorStore = defineStore('calculator', () => {
  const modeResult = useCookie<ModeResult | null>('scopex-mode-result', {
    default: () => null,
    sameSite: 'lax',
  })

  function setModeResult(data: ModeResult) {
    modeResult.value = data
  }

  function reset() {
    modeResult.value = null
  }

  return { modeResult, setModeResult, reset }
})
