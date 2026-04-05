import type { MarketResult, OwnRateResult, ProposalMode, ServiceBreakdownItem } from '~/types'
import { formatPrice } from '~/utils/pricing'

const WATERMARK = 'Рассчитано в ScopeX · scopex.ru'

const GROUP_VALUE_EXPLANATIONS: Record<string, string> = {
  research: 'Этот блок помогает зафиксировать задачу, снять лишние риски и собрать входные данные до визуального этапа.',
  design: 'Здесь проектируется логика интерфейса: сценарии, структура и то, как пользователь проходит путь внутри продукта.',
  ui: 'Этот блок отвечает за финальный визуал, консистентность интерфейса и качество восприятия продукта.',
  delivery: 'Финальный блок нужен, чтобы спокойно пройти согласование, подготовить материалы к сдаче и передаче в работу.',
}

function getPrice(result: MarketResult | OwnRateResult) {
  return result.mode === 'market'
    ? result[result.selectedGrade].mid
    : result.price
}

function getTimeRangeLabel(result: MarketResult | OwnRateResult) {
  return `${result.adjustedHoursMin}–${result.adjustedHoursMax} ч`
}

function getRateLabel(result: MarketResult | OwnRateResult) {
  if (result.mode === 'own-rate')
    return `${result.hourlyRate.toLocaleString('ru-RU')} ₽/ч`

  const selected = result[result.selectedGrade]
  return `${selected.min.toLocaleString('ru-RU')}–${selected.max.toLocaleString('ru-RU')} ₽ за проект по рынку`
}

function formatBreakdownLine(item: ServiceBreakdownItem, withHours = false) {
  const hours = withHours ? ` · ${item.hoursMin}–${item.hoursMax} ч` : ''
  return `— ${item.label} — ${formatPrice(item.price)}${hours}`
}

function groupBreakdown(items: ServiceBreakdownItem[]) {
  const groups = new Map<string, { label: string; items: ServiceBreakdownItem[] }>()

  for (const item of items) {
    const existing = groups.get(item.group)
    if (existing) {
      existing.items.push(item)
      continue
    }

    groups.set(item.group, {
      label: item.groupLabel,
      items: [item],
    })
  }

  return [...groups.entries()].map(([key, value]) => ({ key, ...value }))
}

export function generateModeProposal(result: MarketResult | OwnRateResult, mode: ProposalMode) {
  const totalPrice = formatPrice(getPrice(result))
  const timeRange = getTimeRangeLabel(result)
  const rateLabel = getRateLabel(result)

  if (mode === 'short') {
    return [
      `Оценил задачу — итог ${totalPrice}.`,
      `По времени: ${timeRange}.`,
      result.mode === 'own-rate'
        ? `Ставка: ${rateLabel}.`
        : `Ориентир по рынку: ${rateLabel}. Буфер: ${result.buffer}%.`,
      '',
      'Если формат подходит — обсудим детали.',
      '',
      WATERMARK,
    ].join('\n')
  }

  if (mode === 'standard') {
    return [
      `Оценил задачу — итог по смете ${totalPrice}.`,
      `По времени: ${timeRange}.`,
      result.mode === 'own-rate'
        ? `Ставка: ${rateLabel}.`
        : `Оценка собрана по рыночному ориентиру ${rateLabel} с буфером ${result.buffer}%.`,
      '',
      'Состав работ:',
      ...result.serviceBreakdown.map(item => formatBreakdownLine(item, true)),
      '',
      'Если формат подходит — зафиксируем состав работ и двинемся дальше.',
      '',
      WATERMARK,
    ].join('\n')
  }

  const grouped = groupBreakdown(result.serviceBreakdown)
  const sections = grouped.flatMap((group) => {
    const labels = group.items.map(item => item.label.toLowerCase()).join(', ')
    return [
      `${group.label}: ${labels}.`,
      GROUP_VALUE_EXPLANATIONS[group.key] ?? 'Этот блок нужен, чтобы проект двигался предсказуемо и без лишних потерь по качеству.',
    ]
  })

  return [
    `Оценил задачу — итог по смете ${totalPrice}.`,
    `По времени: ${timeRange}.`,
    result.mode === 'own-rate'
      ? `Ставка: ${rateLabel}.`
      : `Оценка собрана по рыночному ориентиру ${rateLabel} с буфером ${result.buffer}%.`,
    '',
    'Разбивка по позициям:',
    ...result.serviceBreakdown.map(item => formatBreakdownLine(item, true)),
    '',
    'Почему смета собрана именно так:',
    ...sections,
    '',
    'Если формат подходит — обсудим детали и зафиксируем следующий шаг.',
    '',
    WATERMARK,
  ].join('\n')
}
