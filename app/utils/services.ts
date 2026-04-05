import type { ServiceSelection, ServiceBreakdownItem } from '~/types'

export interface ServiceDef {
  id: string
  group: 'research' | 'design' | 'ui' | 'delivery'
  label: string
  hoursMin: number
  hoursMax: number
  tooltip: string
  perScreen?: true
  perRound?: true
  screenModifier?: number
}

export const SERVICE_GROUP_ORDER = ['research', 'design', 'ui', 'delivery'] as const

export const SERVICE_GROUP_LABELS: Record<string, string> = {
  research: 'Исследование и аналитика',
  design: 'Проектирование',
  ui: 'UI дизайн',
  delivery: 'Документация и сдача',
}

export const SERVICES: ServiceDef[] = [
  // Research
  { id: 'briefing', group: 'research', label: 'Брифинг и анализ ТЗ', hoursMin: 2, hoursMax: 4, tooltip: 'Анализ требований, выявление ограничений и бизнес-целей, фиксация scope проекта' },
  { id: 'uxResearch', group: 'research', label: 'UX-исследование / интервью', hoursMin: 8, hoursMax: 16, tooltip: 'Интервью с пользователями, создание персон и user journey map' },
  { id: 'competitiveAnalysis', group: 'research', label: 'Конкурентный анализ', hoursMin: 4, hoursMax: 8, tooltip: 'Анализ 5–10 конкурентов: UI-паттерны, функциональность, позиционирование' },
  { id: 'designAudit', group: 'research', label: 'Аудит текущего дизайна', hoursMin: 4, hoursMax: 8, tooltip: 'Разбор существующего продукта: UX-проблемы, несоответствия, список рекомендаций' },

  // Design
  { id: 'userFlows', group: 'design', label: 'Пользовательские сценарии / флоу', hoursMin: 4, hoursMax: 8, tooltip: 'Карта экранов, пользовательские сценарии и схема взаимодействий' },
  { id: 'wireframes', group: 'design', label: 'Вайрфреймы', hoursMin: 2, hoursMax: 4, tooltip: 'Структурные схемы экранов без визуального оформления', perScreen: true },
  { id: 'prototype', group: 'design', label: 'Прототип (кликабельный)', hoursMin: 4, hoursMax: 8, tooltip: 'Интерактивный прототип для тестирования пользовательских сценариев в Figma' },

  // UI
  { id: 'screenDesign', group: 'ui', label: 'Дизайн экранов', hoursMin: 3, hoursMax: 6, tooltip: 'Финальный UI: визуальное оформление всех экранов в Figma', perScreen: true },
  { id: 'designSystem', group: 'ui', label: 'Дизайн-система / токены', hoursMin: 16, hoursMax: 24, tooltip: 'Компонентная библиотека с токенами, вариантами состояний и документацией' },
  { id: 'adaptive', group: 'ui', label: 'Адаптивная версия', hoursMin: 0, hoursMax: 0, tooltip: '+25% к часам на экраны — мобильная и планшетная версии всех экранов', screenModifier: 0.25 },
  { id: 'darkMode', group: 'ui', label: 'Dark mode', hoursMin: 0, hoursMax: 0, tooltip: '+20% к часам на экраны — тёмная тема для всех экранов', screenModifier: 0.20 },
  { id: 'motion', group: 'ui', label: 'Motion / микроанимации', hoursMin: 8, hoursMax: 16, tooltip: 'Анимации переходов, микровзаимодействия, After Effects / Lottie' },

  // Delivery
  { id: 'revisions', group: 'delivery', label: 'Правки', hoursMin: 2, hoursMax: 4, tooltip: 'Один круг правок: сбор фидбека, итерация по всем экранам, согласование', perRound: true },
  { id: 'handoff', group: 'delivery', label: 'Дизайн-документация / handoff', hoursMin: 4, hoursMax: 8, tooltip: 'Описание компонентов, спецификации для разработки, настройка Figma Dev Mode' },
  { id: 'presentation', group: 'delivery', label: 'Презентация клиенту', hoursMin: 2, hoursMax: 4, tooltip: 'Подготовка слайдов и проведение финальной презентации результатов' },
]

export interface ServiceHours {
  min: number
  max: number
  mid: number
}

function screenDesignHours(screensCount: number): ServiceHours {
  // screenDesign: 3–6 h/screen
  const min = 3 * screensCount
  const max = 6 * screensCount
  return { min, max, mid: Math.round((min + max) / 2) }
}

export function getServiceHours(
  service: ServiceDef,
  screensCount: number,
  revisionsCount: number,
  screenDesignSelected: boolean,
): ServiceHours {
  if (service.screenModifier !== undefined) {
    if (!screenDesignSelected) return { min: 0, max: 0, mid: 0 }
    const sd = screenDesignHours(screensCount)
    const min = Math.round(sd.min * service.screenModifier)
    const max = Math.round(sd.max * service.screenModifier)
    return { min, max, mid: Math.round((min + max) / 2) }
  }
  let min = service.hoursMin
  let max = service.hoursMax
  if (service.perScreen) {
    min = service.hoursMin * screensCount
    max = service.hoursMax * screensCount
  }
  else if (service.perRound) {
    min = service.hoursMin * revisionsCount
    max = service.hoursMax * revisionsCount
  }
  return { min, max, mid: Math.round((min + max) / 2) }
}

export function calculateTotalHours(
  selectedIds: string[],
  screensCount: number,
  revisionsCount: number,
): ServiceHours {
  const sel = new Set(selectedIds)
  const sdSelected = sel.has('screenDesign')
  let totalMin = 0
  let totalMax = 0
  for (const s of SERVICES) {
    if (!sel.has(s.id)) continue
    const h = getServiceHours(s, screensCount, revisionsCount, sdSelected)
    totalMin += h.min
    totalMax += h.max
  }
  return { min: totalMin, max: totalMax, mid: Math.round((totalMin + totalMax) / 2) }
}

export function buildServiceBreakdown(
  selection: ServiceSelection,
  rate: number,
): ServiceBreakdownItem[] {
  const sel = new Set(selection.selectedIds)
  const sdSelected = sel.has('screenDesign')
  return SERVICES
    .filter(s => sel.has(s.id))
    .map((s) => {
      const h = getServiceHours(s, selection.screensCount, selection.revisionsCount, sdSelected)
      return {
        id: s.id,
        group: s.group,
        groupLabel: SERVICE_GROUP_LABELS[s.group] ?? s.group,
        label: s.label,
        hoursMin: h.min,
        hoursMax: h.max,
        price: Math.round((h.mid * rate) / 1000) * 1000,
      }
    })
}

export function getGroupedServices() {
  return SERVICE_GROUP_ORDER.map(groupKey => ({
    key: groupKey,
    label: SERVICE_GROUP_LABELS[groupKey] ?? groupKey,
    services: SERVICES.filter(s => s.group === groupKey),
  }))
}
