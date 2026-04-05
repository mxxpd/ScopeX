import type { Grade } from '~/types'

export interface BenchmarkSource {
  id: string
  title: string
  url: string
  note: string
}

export const MARKET_BENCHMARK_SOURCES: BenchmarkSource[] = [
  {
    id: 'dsgners-rates-2025',
    title: 'DSGNERS — сколько стоит час дизайнера в 2025 году',
    url: 'https://dsgners.ru/evgeniashamray/10849-skolko-stoit-chas-dizaynera-v-2025-godu',
    note: 'Основной ориентир по почасовым ставкам на RU-рынке: выборка из 4 872 объявлений и профилей за первое полугодие 2025 года с вилками по грейдам.',
  },
  {
    id: 'hh-ux-ui',
    title: 'hh.ru — UX/UI-дизайнер',
    url: 'https://hh.ru/article/skills_designer',
    note: 'Локальная зарплатная база и описание роли UX/UI-дизайнера на российском рынке найма.',
  },
  {
    id: 'tbank-demand',
    title: 'Т-Бизнес — спрос на дизайнеров',
    url: 'https://secrets.tbank.ru/novosti/spros-na-dizaynerov/',
    note: 'Служит sanity-check по текущему спросу на дизайнеров и дефициту сильных специалистов на рынке.',
  },
]

export const BENCHMARK_METHOD_STEPS = [
  'Берём публичные данные по ставкам и зарплатам именно российского рынка.',
  'Сводим вместе почасовые рейты, зарплатные ориентиры и текущий спрос на UX/UI- и продуктовых дизайнеров.',
  'Переводим найм в проектную почасовую ставку с поправкой на коммуникации, простои и overhead фриланса.',
  'Оставляем рабочий диапазон, который ближе к продаваемой ставке на рынке, а не к случайным выбросам.',
] as const

export const GRADE_RATES: Record<Grade, { min: number; max: number; label: string; rationale: string }> = {
  junior: {
    min: 1000,
    max: 2000,
    label: 'Junior',
    rationale: 'Опирается на нижний рабочий коридор RU-рынка: в статье DSGNERS junior для UX/UI и web-дизайна стартует примерно с 1 000–2 000 ₽/ч.',
  },
  middle: {
    min: 2000,
    max: 3500,
    label: 'Middle',
    rationale: 'Основная рабочая вилка по рынку 2025–2026: она совпадает с коридором middle из статьи DSGNERS и соответствует тому, как оценивается самостоятельный дизайнер на локальном рынке.',
  },
  senior: {
    min: 3500,
    max: 6000,
    label: 'Senior',
    rationale: 'Верхний рабочий рынок для senior/lead-специалистов с сильным UX, research, product-логикой и зрелым процессом.',
  },
}

export const BENCHMARK_SUMMARY = 'Ставки собраны по данным российского рынка 2025–2026: открытые почасовые рейты дизайнеров, локальные зарплатные ориентиры и текущий спрос на UX/UI-специалистов.'

export function getGradeRateLabel(grade: Grade) {
  const rate = GRADE_RATES[grade]
  return `${rate.min.toLocaleString('ru-RU')}–${rate.max.toLocaleString('ru-RU')} ₽/ч`
}

export function getMarketBenchmarksSummaryLines() {
  return [
    BENCHMARK_SUMMARY,
    ...BENCHMARK_METHOD_STEPS,
  ]
}
