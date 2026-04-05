<template>
  <div class="min-h-[calc(100vh-60px)] px-5 pb-10 pt-5 sm:px-8 sm:pb-12 sm:pt-6 xl:px-20">
    <div class="page-shell section-stack">
      <PageIntro
        back-to="/calculator"
        title="Результат расчёта"
        subtitle="Итог по смете, рыночный контекст и следующий шаг к КП."
      />

      <template v-if="modeResult?.mode === 'market' || modeResult?.mode === 'own-rate'">
        <div class="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_27rem] xl:gap-8">
          <div class="section-stack">
            <section class="surface-card-hero">
              <div class="surface-card-brand">
                <p class="mb-3 text-xs uppercase tracking-widest text-[var(--text-brand-secondary)]">{{ heroLabel }}</p>
                <div class="text-4xl font-semibold text-[var(--text-brand-primary)] sm:text-5xl">{{ heroPrice }}</div>
                <div class="mt-2 text-sm text-[var(--text-brand-secondary)]">{{ heroSubline }}</div>
                <p class="mt-1 text-xs text-[var(--text-brand-secondary)]">{{ heroCaption }}</p>
              </div>
              <div class="surface-card">
                <template v-if="modeResult.mode === 'market'">
                  <p class="mb-4 text-xs font-medium uppercase tracking-wide text-[var(--text-tertiary)]">Позиция на рынке</p>
                  <div class="relative">
                    <div class="relative h-2 overflow-hidden rounded-full bg-[var(--bg-surface-raised)]">
                      <div class="absolute inset-y-0 left-0 rounded-full" :style="{ width: gradeScalePercent + '%', background: 'var(--accent-bg)' }" />
                    </div>
                    <div class="mt-2 flex justify-between text-xs text-[var(--text-tertiary)]">
                      <span :class="modeResult.selectedGrade === 'junior' ? 'font-medium text-[var(--accent-subtle-on)]' : ''">Junior</span>
                      <span :class="modeResult.selectedGrade === 'middle' ? 'font-medium text-[var(--accent-subtle-on)]' : ''">Middle</span>
                      <span :class="modeResult.selectedGrade === 'senior' ? 'font-medium text-[var(--accent-subtle-on)]' : ''">Senior</span>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <p class="mb-3 text-xs font-medium uppercase tracking-wide text-[var(--text-tertiary)]">Сравнение с рынком (Middle)</p>
                  <div class="mb-3">
                    <div class="relative h-4">
                      <div class="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-[var(--bg-surface-raised)]">
                        <div class="absolute inset-y-0 rounded-full bg-[var(--border-default)]" style="left: 25%; right: 25%;" />
                      </div>
                      <div class="absolute top-1/2 h-3 w-3 rounded-full border-2 border-white shadow-sm transition-all" :class="ownRateFeedback.dotClass" :style="{ left: ownRateScalePercent + '%', transform: 'translate(-50%, -50%)' }" />
                    </div>
                    <div class="mt-2 flex items-center justify-between gap-4 text-xs text-[var(--text-tertiary)]">
                      <span class="whitespace-nowrap">{{ formatPrice(modeResult.market.min) }}</span>
                      <span class="whitespace-nowrap">{{ formatPrice(modeResult.market.max) }}</span>
                    </div>
                  </div>
                  <div class="rounded-xl px-4 py-3 text-sm font-medium" :class="ownRateFeedback.cardClass">{{ ownRateFeedback.text }}</div>
                </template>
              </div>
            </section>

            <PricePositionHint
              v-if="modeResult.mode === 'own-rate'"
              :position="pricePosition"
              :market-mid="pricePositionMarketMid"
            />

            <section v-if="modeResult.mode === 'market'" class="grid gap-3 sm:grid-cols-3">
              <SelectableCard
                v-for="g in gradeCards"
                :key="g.key"
                :title="g.label"
                :subtitle="g.rateLabel"
                :selected="modeResult.selectedGrade === g.key"
                :badge="modeResult.selectedGrade === g.key ? 'Выбран' : undefined"
              >
                <div class="mt-3">
                  <div class="mb-0.5 text-xl font-semibold" :class="modeResult.selectedGrade === g.key ? 'text-[var(--accent-subtle-on)]' : 'text-[var(--text-primary)]'">{{ formatPrice(modeResult[g.key].mid) }}</div>
                  <div class="text-xs" :class="modeResult.selectedGrade === g.key ? 'text-[var(--accent-subtle-on)] opacity-70' : 'text-[var(--text-tertiary)]'">{{ formatPrice(modeResult[g.key].min) }} — {{ formatPrice(modeResult[g.key].max) }}</div>
                </div>
              </SelectableCard>
            </section>

            <ServiceBreakdownBlock
              :groups="groupedServiceBreakdown"
              :badge="`${selectedServicesCount} поз.`"
              description="Разбивка по выбранным услугам"
            />

            <BenchmarkSourcesBlock
              :summary="benchmarkSummary"
              :sources="benchmarkSources"
            />
          </div>
          <aside class="sticky-sidebar">
            <div class="space-y-4">
              <SidebarHeroCard
                eyebrow="Ожидаемая стоимость"
                :title="heroPrice"
                :subtitle="recommendedRangeLabel"
              >
                <div class="px-5 py-5 sm:px-6">
                  <MetaList :items="sidebarMetaItems" />
                </div>
              </SidebarHeroCard>

              <ActionPanel
                eyebrow="Следующий шаг"
                description="Из этой сметы можно сразу собрать текст для клиента в форматах Telegram, Email и с обоснованием стоимости."
              >
                <button class="primary-btn mt-4 w-full rounded-xl py-3.5 text-base font-medium" @click="router.push('/proposal')">Сформировать КП</button>
              </ActionPanel>
            </div>
          </aside>
        </div>
      </template>

      <template v-else-if="modeResult?.mode === 'self-check'">
        <div class="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_27rem] xl:gap-8">
          <div class="section-stack">
            <section class="surface-card">
              <p class="eyebrow-label mb-2">Ваша цена</p>
              <div class="mb-6 text-3xl font-semibold text-[var(--text-primary)] sm:text-4xl">{{ formatPrice(modeResult.quotedPrice) }}</div>
              <div class="mb-6">
                <div class="relative flex h-8 items-center">
                  <div class="absolute inset-x-0 h-3 rounded-full bg-[var(--bg-surface-raised)]" />
                  <div class="market-scale-segment market-scale-segment-junior" />
                  <div class="market-scale-segment market-scale-segment-middle" />
                  <div class="market-scale-segment market-scale-segment-senior" />
                  <div class="absolute z-10 h-5 w-5 rounded-full border-2 border-white bg-[var(--text-primary)] shadow-md transition-all" :style="{ left: modeResult.positionPercent + '%', transform: 'translateX(-50%)' }" />
                </div>
                <div class="mt-2 flex text-xs text-[var(--text-tertiary)]">
                  <span class="w-1/3 text-left">Junior</span>
                  <span class="w-1/3 text-center">Middle</span>
                  <span class="w-1/3 text-right">Senior</span>
                </div>
              </div>
              <div class="rounded-lg px-4 py-4 text-center" :class="selfCheckFeedback.cardClass">
                <p class="mb-1 text-base font-semibold" :class="selfCheckFeedback.titleClass">{{ selfCheckFeedback.title }}</p>
                <p class="text-sm leading-relaxed" :class="selfCheckFeedback.textClass">{{ selfCheckFeedback.text }}</p>
              </div>
            </section>

            <section class="surface-card">
              <p class="eyebrow-label mb-3">Ориентиры по грейдам для этого проекта</p>
              <div class="space-y-2">
                <div v-for="g in selfCheckGradeRows" :key="g.key" class="flex items-center justify-between rounded-lg px-3 py-1.5" :class="selfCheckActiveGrade === g.key ? 'bg-[var(--bg-surface-raised)]' : ''">
                  <span class="text-sm text-[var(--text-secondary)]">{{ g.label }}</span>
                  <span class="text-sm font-medium text-[var(--text-primary)]">{{ formatPrice(g.min) }} — {{ formatPrice(g.max) }}</span>
                </div>
              </div>
            </section>

            <SelfCheckAdvice
              :position="selfCheckPosition"
              :market-mid="modeResult.market.mid"
              :quoted-price="modeResult.quotedPrice"
            />
          </div>

          <aside class="sticky-sidebar">
            <div class="space-y-4">
              <SidebarHeroCard
                eyebrow="Проверка цены"
                :title="formatPrice(modeResult.quotedPrice)"
                :subtitle="selfCheckFeedback.title"
              >
                <div class="px-5 py-5 sm:px-6">
                  <MetaList :items="selfCheckSidebarItems" />
                </div>
              </SidebarHeroCard>

              <ActionPanel
                eyebrow="Что дальше"
                description="Если цена не устраивает, вернитесь в калькулятор и пересоберите состав работ, объём или ставку."
              >
                <button class="mt-4 w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface-raised)] py-3.5 text-base font-medium text-[var(--text-primary)] transition-all hover:border-[var(--border-strong)]" @click="router.push('/calculator')">Вернуться к расчёту</button>
              </ActionPanel>
            </div>
          </aside>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BENCHMARK_SUMMARY, GRADE_RATES, MARKET_BENCHMARK_SOURCES, getGradeRateLabel } from '~/utils/benchmarks'
import { getOwnRateFeedback, getSelfCheckFeedback } from '~/utils/market-feedback'
import { formatPrice } from '~/utils/pricing'

definePageMeta({ middleware: 'require-form' })
const store = useCalculatorStore()
const modeResult = computed(() => store.modeResult)
const router = useRouter()
const GRADE_LABELS: Record<string, string> = { junior: 'Junior', middle: 'Middle', senior: 'Senior' }
const gradeCards = [
  { key: 'junior' as const, label: 'Junior', rateLabel: getGradeRateLabel('junior') },
  { key: 'middle' as const, label: 'Middle', rateLabel: getGradeRateLabel('middle') },
  { key: 'senior' as const, label: 'Senior', rateLabel: getGradeRateLabel('senior') },
]
const benchmarkSummary = BENCHMARK_SUMMARY
const benchmarkSources = MARKET_BENCHMARK_SOURCES
const detailedModeResult = computed(() => modeResult.value?.mode === 'market' || modeResult.value?.mode === 'own-rate' ? modeResult.value : null)
const selectedGradeLabel = computed(() => {
  if (modeResult.value?.mode !== 'market') return ''
  return GRADE_LABELS[modeResult.value.selectedGrade] ?? ''
})
const selectedServicesCount = computed(() => detailedModeResult.value?.serviceBreakdown.length ?? 0)
const selectedScreensCount = computed(() => detailedModeResult.value?.services.screensCount ?? 0)
const selectedRevisionsCount = computed(() => detailedModeResult.value?.services.revisionsCount ?? 0)
const selectedHoursRangeLabel = computed(() => {
  const result = detailedModeResult.value
  if (!result) return ''
  return `${result.adjustedHoursMin}–${result.adjustedHoursMax} ч`
})
const recommendedRangeLabel = computed(() => detailedModeResult.value ? `${formatPrice(detailedModeResult.value.recommendedMin)} — ${formatPrice(detailedModeResult.value.recommendedMax)}` : '')
const marketRateLabel = computed(() => {
  if (modeResult.value?.mode !== 'market') return ''
  const result = modeResult.value
  return gradeCards.find(card => card.key === result.selectedGrade)?.rateLabel ?? ''
})
const marketSelectedPriceLabel = computed(() => {
  if (modeResult.value?.mode !== 'market') return ''
  const result = modeResult.value
  return formatPrice(result[result.selectedGrade].mid)
})
const adjustedHoursRangeLabel = computed(() => modeResult.value?.mode === 'own-rate' ? `${modeResult.value.adjustedHoursMin}–${modeResult.value.adjustedHoursMax} ч` : '')
const ownRateLabel = computed(() => modeResult.value?.mode === 'own-rate' ? `${modeResult.value.hourlyRate.toLocaleString('ru-RU')} ₽/ч` : '')
const groupedServiceBreakdown = computed(() => {
  const result = detailedModeResult.value
  if (!result) return []
  const groups = new Map<string, { key: string; label: string; items: typeof result.serviceBreakdown }>()
  for (const item of result.serviceBreakdown) {
    const existing = groups.get(item.group)
    if (existing) existing.items.push(item)
    else groups.set(item.group, { key: item.group, label: item.groupLabel, items: [item] })
  }
  return [...groups.values()]
})
const gradeScalePercent = computed(() => {
  if (modeResult.value?.mode !== 'market') return 0
  const map: Record<string, number> = { junior: 17, middle: 50, senior: 83 }
  return map[modeResult.value.selectedGrade] ?? 50
})
const ownRateScalePercent = computed(() => {
  if (modeResult.value?.mode !== 'own-rate') return 50
  const { price, market } = modeResult.value
  const scaleMin = market.min * 0.5
  const scaleMax = market.max * 2
  const clamped = Math.max(scaleMin, Math.min(scaleMax, price))
  const percent = Math.round(((clamped - scaleMin) / (scaleMax - scaleMin)) * 100)
  return Math.max(4, Math.min(96, percent))
})
const ownRateFeedback = computed(() => modeResult.value?.mode === 'own-rate'
  ? getOwnRateFeedback(modeResult.value.marketPosition)
  : { text: '', cardClass: '', dotClass: 'bg-gray-400' })
const heroLabel = computed(() => {
  if (modeResult.value?.mode === 'market') return `ScopeX · Рыночная оценка · ${selectedGradeLabel.value}`
  if (modeResult.value?.mode === 'own-rate') return 'ScopeX · Ваша цена'
  return ''
})
const heroPrice = computed(() => {
  if (modeResult.value?.mode === 'market') return marketSelectedPriceLabel.value
  if (modeResult.value?.mode === 'own-rate') return formatPrice(modeResult.value.price)
  return ''
})
const heroSubline = computed(() => {
  if (modeResult.value?.mode === 'market') return recommendedRangeLabel.value
  if (modeResult.value?.mode === 'own-rate') return adjustedHoursRangeLabel.value
  return ''
})
const heroCaption = computed(() => {
  if (modeResult.value?.mode === 'market') return `С учётом буфера ${modeResult.value.buffer}% · ${selectedHoursRangeLabel.value}`
  if (modeResult.value?.mode === 'own-rate') return 'С учётом вашего буфера на коммуникации и правки'
  return ''
})
const sideRateLabel = computed(() => modeResult.value?.mode === 'market' ? 'Базовая ставка' : 'Ставка')
const sideRateValue = computed(() => modeResult.value?.mode === 'market' ? marketRateLabel.value : ownRateLabel.value)
const sidebarMetaItems = computed(() => {
  if (modeResult.value?.mode === 'market') {
    return [
      { label: 'Время', value: selectedHoursRangeLabel.value },
      { label: 'Буфер', value: `${modeResult.value.buffer}%` },
      { label: sideRateLabel.value, value: sideRateValue.value, divider: true },
      { label: 'Экранов', value: selectedScreensCount.value },
      { label: 'Кругов правок', value: selectedRevisionsCount.value },
    ]
  }

  return [
    { label: 'Время', value: selectedHoursRangeLabel.value },
    { label: sideRateLabel.value, value: sideRateValue.value },
    { label: 'Экранов', value: selectedScreensCount.value, divider: true },
    { label: 'Кругов правок', value: selectedRevisionsCount.value },
  ]
})
const selfCheckSidebarItems = computed(() => ([
  { label: 'Middle рынок', value: `${formatPrice(modeResult.value?.mode === 'self-check' ? modeResult.value.market.min : 0)} — ${formatPrice(modeResult.value?.mode === 'self-check' ? modeResult.value.market.max : 0)}` },
]))
const selfCheckFeedback = computed(() => modeResult.value?.mode === 'self-check'
  ? getSelfCheckFeedback(modeResult.value.marketPosition)
  : { title: '', text: '', cardClass: '', titleClass: '', textClass: '' })
const selfCheckGradeRows = computed(() => {
  if (modeResult.value?.mode !== 'self-check') return []
  const { allGrades } = modeResult.value
  return [
    { key: 'junior', label: 'Junior', ...allGrades.junior },
    { key: 'middle', label: 'Middle', ...allGrades.middle },
    { key: 'senior', label: 'Senior', ...allGrades.senior },
  ]
})
const selfCheckActiveGrade = computed(() => {
  if (modeResult.value?.mode !== 'self-check') return null
  const { quotedPrice, allGrades } = modeResult.value
  if (quotedPrice <= allGrades.junior.max) return 'junior'
  if (quotedPrice <= allGrades.middle.max) return 'middle'
  return 'senior'
})

const selfCheckPosition = computed((): 'below' | 'market' | 'above' => {
  if (modeResult.value?.mode !== 'self-check') return 'market'
  const { quotedPrice, allGrades } = modeResult.value
  const juniorMid = allGrades.junior.mid
  const seniorMax = allGrades.senior.max
  if (quotedPrice > seniorMax * 1.1) return 'above'
  if (quotedPrice < juniorMid * 0.8) return 'below'
  return 'market'
})

const pricePosition = computed((): 'below' | 'market' | 'above' => {
  if (modeResult.value?.mode !== 'own-rate') return 'market'
  const { price, adjustedHours } = modeResult.value
  const seniorMax = GRADE_RATES.senior.max * adjustedHours
  const juniorMid = ((GRADE_RATES.junior.min + GRADE_RATES.junior.max) / 2) * adjustedHours
  if (price > seniorMax * 1.1) return 'above'
  if (price < juniorMid * 0.9) return 'below'
  return 'market'
})

const pricePositionMarketMid = computed(() => {
  if (modeResult.value?.mode !== 'own-rate') return 0
  return modeResult.value.market.mid
})
</script>
