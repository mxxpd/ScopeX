import type { CalculationResult, ProposalMode } from '~/types'
import { formatPrice, PROJECT_LABELS } from '~/utils/pricing'

const ADDON_LABELS: Partial<Record<string, string>> = {
  research: 'UX-исследование',
  prototype: 'интерактивный прототип',
  designSystem: 'дизайн-система',
  adaptive: 'адаптив',
  copywriting: 'копирайтинг',
  devHandoff: 'передача в разработку',
  urgent: 'срочное выполнение',
}

const VALUE_BY_TYPE: Record<string, string> = {
  landing: 'Лендинг — это лицо продукта. Делаю так, чтобы он продавал, а не просто выглядел.',
  corporate: 'Корпоративный сайт формирует доверие. Каждый экран продуман под задачи бизнеса.',
  ecommerce: 'Магазин должен конвертировать. Проектирую путь пользователя от входа до оплаты.',
  mobile: 'Мобильное приложение — это продукт которым пользуются каждый день. Делаю его понятным с первого запуска.',
  presentation: 'Презентация должна убеждать без слов. Строю визуальную логику под вашу аудиторию.',
  branding: 'Бренд — это система, а не просто логотип. Создаю то, что работает на всех носителях.',
}

const WATERMARK = 'Рассчитано в ScopeX · scopex.ru'

function getActiveAddons(result: CalculationResult): string[] {
  return (Object.entries(result.formData.addons) as [string, boolean][])
    .filter(([, active]) => active)
    .map(([key]) => ADDON_LABELS[key])
    .filter((label): label is string => Boolean(label))
}

export function generateProposal(result: CalculationResult, mode: ProposalMode): string {
  const projectLabel = PROJECT_LABELS[result.formData.projectType]
  const price = formatPrice(result.finalPrice)
  const { min, max } = result.weeks
  const weeksStr = `${min}–${max}`
  const addons = getActiveAddons(result)

  if (mode === 'short') {
    const addonsLine = addons.length > 0 ? `\nВходит: ${addons.join(', ')}.` : ''
    return `${projectLabel} — ${price}.\n\nСрок: ${weeksStr} нед.${addonsLine}\n\nГотов обсудить детали.\n\n${WATERMARK}`
  }

  if (mode === 'standard') {
    const parts: string[] = []

    parts.push(`Оценил задачу. ${projectLabel} — ${price}.`)

    if (addons.length > 0) {
      const top3 = result.breakdown.slice(0, 3).map(i => i.label).join(', ')
      parts.push(`В стоимость входит: ${top3}.`)
    }

    parts.push(`Срок реализации — ${weeksStr} недели.`)
    parts.push(`Если формат подходит — обсудим детали и зафиксируем состав работ.`)

    return parts.join('\n\n') + `\n\n${WATERMARK}`
  }

  // extended
  const top3 = result.breakdown.slice(0, 3).map(i => i.label).join('\n')
  const valuePhrase = VALUE_BY_TYPE[result.formData.projectType] ?? ''

  const parts: string[] = [
    `Посмотрел задачу — готов взяться. ${projectLabel} — ${price}.`,
    `Что входит:\n${top3}`,
    valuePhrase,
    `Срок — ${weeksStr} недели. Работаю итерациями: сначала концепция, потом детали — без сюрпризов в конце.`,
    `Если интересно — напишите, созвонимся и обсудим детали.`,
  ]

  return parts.join('\n\n') + `\n\n${WATERMARK}`
}
