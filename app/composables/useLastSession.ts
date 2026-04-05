import { useLocalStorage } from '@vueuse/core'

export interface LastSession {
  savedAt: string
  mode: 'market' | 'own-rate' | 'self-check'
  formData: {
    level?: 'junior' | 'middle' | 'senior'
    hourlyRate?: number
    myQuote?: number
    screens: number
    rounds: number
    buffer: number
    selectedServices: string[]
  }
  result: {
    totalPrice: number
    totalHours: number
    pricePosition: 'below' | 'market' | 'above'
  }
}

const SESSION_KEY = 'scopex-last-session'
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000

export function useLastSession() {
  const stored = useLocalStorage<LastSession | null>(SESSION_KEY, null)

  const hasValidSession = computed(() => {
    if (!import.meta.client) return false
    if (!stored.value) return false
    const age = Date.now() - new Date(stored.value.savedAt).getTime()
    return age < MAX_AGE_MS
  })

  function save(session: LastSession) {
    if (!import.meta.client) return
    stored.value = session
  }

  function clear() {
    if (!import.meta.client) return
    stored.value = null
  }

  return { stored, hasValidSession, save, clear }
}
