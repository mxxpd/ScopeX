import type { FormData, ProjectType, Complexity, CalculationResult, BreakdownItem } from '~/types'

export const PROJECT_LABELS: Record<ProjectType, string> = {
  landing: 'лендинг',
  corporate: 'корпоративный сайт',
  ecommerce: 'интернет-магазин',
  mobile: 'мобильное приложение',
  presentation: 'презентацию',
  branding: 'брендинг',
}

const BASE_RATES: Record<ProjectType, number> = {
  landing: 2000,
  corporate: 3000,
  ecommerce: 3500,
  mobile: 4000,
  presentation: 1500,
  branding: 2500,
}

const COMPLEXITY_MULTIPLIER: Record<Complexity, number> = {
  basic: 0.8,
  standard: 1.0,
  advanced: 1.4,
}

const MINIMUM_PRICE: Record<ProjectType, number> = {
  landing: 35000,
  corporate: 60000,
  ecommerce: 90000,
  mobile: 80000,
  presentation: 25000,
  branding: 40000,
}

const BASE_RATE_PER_SCREEN = BASE_RATES

const BASE_WEEKS_PER_SCREEN: Record<ProjectType, number> = {
  landing: 0.3,
  corporate: 0.4,
  ecommerce: 0.5,
  mobile: 0.5,
  presentation: 0.25,
  branding: 0.35,
}

const ADDON_PRICES = {
  research: 15000,
  prototype: 10000,
  designSystem: 20000,
  adaptive: 0.2,   // процент от baseAmount
  copywriting: 5000,
  devHandoff: 6000,
}

const FIXED_ADDON_DEFS = [
  { key: 'research' as const, label: 'Исследование', explanation: 'UX-аудит и анализ конкурентов' },
  { key: 'prototype' as const, label: 'Прототип', explanation: 'Кликабельный прототип в Figma' },
  { key: 'designSystem' as const, label: 'Дизайн-система', explanation: 'Компонентная библиотека и стили' },
  { key: 'copywriting' as const, label: 'Копирайтинг', explanation: 'Тексты для всех экранов' },
  { key: 'devHandoff' as const, label: 'Передача разработчикам', explanation: 'Спецификации и экспорт ассетов' },
]

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU').format(price) + ' ₽'
}

export function calculateResult(formData: FormData): CalculationResult {
  const f = formData
  const breakdown: BreakdownItem[] = []

  const baseAmount = BASE_RATE_PER_SCREEN[f.projectType] * f.scopeValue * COMPLEXITY_MULTIPLIER[f.complexity]
  breakdown.push({
    label: `UI дизайн (${f.scopeValue} экранов)`,
    amount: Math.round(baseAmount),
    explanation: `${f.scopeValue} экранов × ${BASE_RATE_PER_SCREEN[f.projectType]} ₽ × коэфф. ${COMPLEXITY_MULTIPLIER[f.complexity]}`,
  })

  if (f.addons.adaptive) {
    const adaptiveAmount = Math.round(baseAmount * ADDON_PRICES.adaptive / 1000) * 1000
    breakdown.push({
      label: 'Адаптив',
      amount: adaptiveAmount,
      explanation: `Мобильная + планшетная версия, ×${ADDON_PRICES.adaptive} к базе экранов`,
    })
  }

  if (f.revisions > 0) {
    breakdown.push({
      label: 'Круги правок',
      amount: f.revisions * 2000,
      explanation: `${f.revisions} × 2 000 ₽ за круг`,
    })
  }

  for (const addon of FIXED_ADDON_DEFS) {
    if (f.addons[addon.key]) {
      breakdown.push({ label: addon.label, amount: ADDON_PRICES[addon.key] as number, explanation: addon.explanation })
    }
  }

  const subtotal = breakdown.reduce((sum, item) => sum + item.amount, 0)

  if (f.addons.urgent) {
    breakdown.push({
      label: 'Срочность',
      amount: Math.round(subtotal * 0.5),
      explanation: 'Приоритетная работа — надбавка 50%',
    })
  }

  const rawPrice = breakdown.reduce((sum, item) => sum + item.amount, 0)
  const finalPrice = Math.round(Math.max(rawPrice, MINIMUM_PRICE[f.projectType]) / 1000) * 1000
  const minPrice = Math.round(finalPrice * 0.85 / 1000) * 1000
  const maxPrice = Math.round(finalPrice * 1.15 / 1000) * 1000

  const baseWeeks = f.scopeValue * BASE_WEEKS_PER_SCREEN[f.projectType] + f.revisions * 0.5
  const factor = f.addons.urgent ? 0.7 : 1
  const adjusted = baseWeeks * factor
  const minWeeks = Math.max(1, Math.floor(adjusted))
  const maxWeeks = Math.max(2, Math.ceil(adjusted * 1.3))

  return { finalPrice, minPrice, maxPrice, breakdown, weeks: { min: minWeeks, max: maxWeeks }, formData }
}
