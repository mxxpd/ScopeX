<template>
  <div class="min-h-[calc(100vh-60px)] px-5 pb-10 pt-5 sm:px-8 sm:pb-12 sm:pt-6 xl:px-20">
    <form class="page-shell space-y-6 xl:space-y-8" @submit.prevent="onSubmit">
      <PageIntro
        back-to="/"
        title="Новый расчёт"
        subtitle="Сначала задайте логику цены, затем соберите состав работ и проверьте итог справа."
        title-class="text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl"
      />

      <SegmentedControl v-model="mode" :items="modes" />

      <div class="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_27rem] xl:gap-8">
        <div class="section-stack">
          <section v-if="mode === 'market'" class="surface-card-subtle">
            <div>
              <p class="eyebrow-label">Ваш грейд</p>
              <h3 class="mt-2 text-lg font-semibold text-[var(--text-primary)]">Переключайте грейд и смотрите, как меняется цена</h3>
            </div>

            <div class="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <button
                v-for="g in grades"
                :key="g.value"
                type="button"
                class="text-left"
                @click="grade = g.value"
              >
                <SelectableCard
                  :title="g.label"
                  :subtitle="g.rate"
                  :selected="grade === g.value"
                />
              </button>
            </div>
          </section>

          <section v-else-if="mode === 'own-rate'" class="surface-card-subtle">
            <p class="eyebrow-label">Часовая ставка</p>
            <div class="mt-4 flex items-center gap-3">
              <input
                v-model.number="hourlyRate"
                type="number"
                min="100"
                max="50000"
                step="100"
                placeholder="2000"
                class="input-shell flex-1"
              >
              <span class="flex-shrink-0 text-sm text-[var(--text-secondary)]">₽/ч</span>
            </div>
            <p class="mt-3 text-xs leading-relaxed text-[var(--text-tertiary)]">
              Junior: {{ getGradeRateLabel('junior') }} · Middle: {{ getGradeRateLabel('middle') }} · Senior: {{ getGradeRateLabel('senior') }}
            </p>
          </section>

          <section
            v-if="mode !== 'self-check'"
            class="surface-card"
          >
            <div class="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div class="section-heading">
                <p class="eyebrow-label">Состав работ</p>
                <h2 class="section-title">Соберите смету проекта</h2>
              </div>
              <p class="page-lead max-w-xl text-sm">
                Выберите реальные задачи проекта. Превью справа сразу покажет ожидаемую стоимость и диапазон.
              </p>
            </div>
            <ServiceConstructor v-model="services" :rate="effectiveRate" :show-summary="false" />
          </section>

          <section v-if="mode === 'market' || mode === 'own-rate'" class="surface-card-subtle">
            <div class="flex items-center justify-between gap-3">
              <p class="eyebrow-label">Буфер на правки и созвоны</p>
              <span class="text-lg font-semibold text-[var(--text-primary)]">{{ buffer }}%</span>
            </div>
            <div class="slider-track-wrap mt-4">
              <input
                v-model.number="buffer"
                type="range"
                min="0"
                max="50"
                step="5"
                class="scope-slider"
                :style="{ accentColor: 'var(--accent-bg)' }"
              >
            </div>
            <div class="mt-1 flex justify-between text-xs text-[var(--text-tertiary)]">
              <span>0%</span>
              <span>+50%</span>
            </div>
            <p class="mt-3 text-xs leading-relaxed text-[var(--text-tertiary)]">
              Итоговые часы: {{ baseHoursPreview }} x {{ bufferMultiplierLabel }} = {{ adjustedHoursPreview }} ч
            </p>
          </section>

          <section v-if="mode === 'self-check'" class="space-y-4">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-xs font-medium uppercase tracking-[0.18em] text-[var(--text-tertiary)]">Параметры расчёта</p>
                <h2 class="mt-2 text-xl font-semibold text-[var(--text-primary)]">
                  {{ mode === 'self-check' ? 'Введите данные проекта' : 'Уточните ставку и условия' }}
                </h2>
              </div>
            </div>

            <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.9fr)]">
              <div class="surface-card-subtle">
                <p class="eyebrow-label">Тип проекта</p>
                <div class="mt-4">
                  <ProjectTypeSelect v-model="projectType" />
                </div>
              </div>

              <div class="surface-card-subtle">
                <p class="eyebrow-label">Объём</p>
                <div class="mt-4">
                  <ScopeSlider v-model="scopeValue" />
                </div>
              </div>

              <div class="surface-card-subtle">
                <p class="eyebrow-label">Сумма клиента</p>
                <div class="mt-4 flex items-center gap-3">
                  <input
                    v-model.number="quotedPrice"
                    type="number"
                    min="1000"
                    max="10000000"
                    step="1000"
                    placeholder="80000"
                    class="input-shell flex-1"
                  >
                  <span class="flex-shrink-0 text-sm text-[var(--text-secondary)]">₽</span>
                </div>
              </div>
            </div>
          </section>

          <section v-if="mode === 'market'" class="surface-card-subtle">
            <p class="eyebrow-label">Ориентиры рынка</p>
            <p class="page-lead mt-4 text-sm">{{ BENCHMARK_SUMMARY }}</p>
          </section>
        </div>

        <aside class="sticky-sidebar">
          <CalculatorPreviewCard
            :preview="previewCard"
            :empty-description="previewPlaceholder"
            :submit-label="submitLabel"
          />
        </aside>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import { useCalculatorStore } from '~/stores/calculator'
import { BENCHMARK_SUMMARY, GRADE_RATES, getGradeRateLabel } from '~/utils/benchmarks'
import {
  calculateMarketResult,
  calculateOwnRateResult,
  calculateSelfCheckResult,
} from '~/utils/market-pricing'
import { getMarketPositionLabel } from '~/utils/market-feedback'
import { formatPrice, PROJECT_LABELS } from '~/utils/pricing'
import { calculateTotalHours } from '~/utils/services'
import type {
  CalculationMode,
  Grade,
  MarketResult,
  OwnRateResult,
  ProjectType,
  SelfCheckResult,
  ServiceSelection,
} from '~/types'

const store = useCalculatorStore()
const router = useRouter()
const toast = useToast()

const mode = useLocalStorage<CalculationMode>('scopex-mode', 'market')

const modes: { value: CalculationMode; label: string }[] = [
  { value: 'market', label: 'По рынку' },
  { value: 'own-rate', label: 'По своей ставке' },
  { value: 'self-check', label: 'Проверить себя' },
]

const grade = ref<Grade>('middle')
const grades = [
  { value: 'junior' as Grade, label: 'Junior', rate: getGradeRateLabel('junior') },
  { value: 'middle' as Grade, label: 'Middle', rate: getGradeRateLabel('middle') },
  { value: 'senior' as Grade, label: 'Senior', rate: getGradeRateLabel('senior') },
]

const projectType = ref<ProjectType>('landing')
const scopeValue = ref(7)

const services = ref<ServiceSelection>({
  selectedIds: [],
  screensCount: 5,
  revisionsCount: 1,
})

const hourlyRate = ref(2000)
const buffer = ref(20)
const quotedPrice = ref(80000)

const effectiveRate = computed(() => {
  if (mode.value === 'market') {
    const r = GRADE_RATES[grade.value]
    return Math.round((r.min + r.max) / 2)
  }
  if (mode.value === 'own-rate') return hourlyRate.value
  return 0
})

const baseHoursPreview = computed(() =>
  calculateTotalHours(services.value.selectedIds, services.value.screensCount, services.value.revisionsCount).mid,
)
const bufferMultiplierLabel = computed(() => `(1 + ${buffer.value}%)`)
const adjustedHoursPreview = computed(() =>
  Math.round(baseHoursPreview.value * (1 + buffer.value / 100)),
)

const submitLabel = computed(() => {
  if (mode.value === 'market') return 'Посмотреть рыночные ставки'
  if (mode.value === 'own-rate') return 'Рассчитать стоимость'
  return 'Сравнить с рынком'
})

const selectedServicesCount = computed(() => services.value.selectedIds.length)

const marketPreviewResult = computed<MarketResult | null>(() => {
  if (mode.value !== 'market' || selectedServicesCount.value === 0) return null
  return calculateMarketResult({ grade: grade.value, buffer: buffer.value, services: services.value })
})

const ownRatePreviewResult = computed<OwnRateResult | null>(() => {
  if (mode.value !== 'own-rate' || selectedServicesCount.value === 0 || hourlyRate.value < 100) return null
  return calculateOwnRateResult({ hourlyRate: hourlyRate.value, buffer: buffer.value, services: services.value })
})

const selfCheckPreviewResult = computed<SelfCheckResult | null>(() => {
  if (mode.value !== 'self-check' || quotedPrice.value < 1000) return null
  return calculateSelfCheckResult({
    quotedPrice: quotedPrice.value,
    projectType: projectType.value,
    scopeValue: scopeValue.value,
  })
})

function getSelectedGradePrice(result: MarketResult) {
  if (result.selectedGrade === 'junior') return result.junior
  if (result.selectedGrade === 'senior') return result.senior
  return result.middle
}

const previewCard = computed(() => {
  if (mode.value === 'market' && marketPreviewResult.value) {
    const result = marketPreviewResult.value
    const gradePrice = getSelectedGradePrice(result)
    return {
      primary: formatPrice(gradePrice.mid),
      secondary: `${formatPrice(result.recommendedMin)} — ${formatPrice(result.recommendedMax)} для клиента`,
      metaTitle: 'Превью сметы',
      helper: 'Это ориентир по выбранному грейду, составу работ и буферу на коммуникации. Точный экран результата покажет полный диапазон по рынку.',
      lines: [
        { label: 'Услуг в смете', value: `${selectedServicesCount.value}` },
        { label: 'Время', value: `${result.adjustedHoursMin}–${result.adjustedHoursMax} ч` },
        { label: 'Буфер', value: `${buffer.value}%` },
        { label: 'Грейд', value: `${GRADE_RATES[grade.value].label} · ${getGradeRateLabel(grade.value)}` },
      ],
    }
  }

  if (mode.value === 'own-rate' && ownRatePreviewResult.value) {
    const result = ownRatePreviewResult.value
    return {
      primary: formatPrice(result.price),
      secondary: `${result.adjustedHoursMin}–${result.adjustedHoursMax} ч с буфером`,
      metaTitle: 'Превью сметы',
      helper: 'Считаем по вашей ставке и сразу добавляем запас на коммуникации, согласования и правки.',
      lines: [
        { label: 'Ставка', value: `${hourlyRate.value.toLocaleString('ru-RU')} ₽/ч` },
        { label: 'Буфер', value: `${buffer.value}%` },
        { label: 'Рекомендуемый диапазон', value: `${formatPrice(result.recommendedMin)} — ${formatPrice(result.recommendedMax)}` },
      ],
    }
  }

  if (mode.value === 'self-check' && selfCheckPreviewResult.value) {
    const result = selfCheckPreviewResult.value
    return {
      primary: formatPrice(quotedPrice.value),
      secondary: `Рынок: ${formatPrice(result.market.min)} — ${formatPrice(result.market.max)}`,
      metaTitle: 'Сверка с рынком',
      helper: 'Этот режим помогает понять, насколько названная сумма попадает в рыночный коридор для такого проекта.',
      lines: [
        { label: 'Проект', value: PROJECT_LABELS[projectType.value] },
        { label: 'Объём', value: `${scopeValue.value} экранов` },
        { label: 'Позиция', value: getMarketPositionLabel(result.marketPosition) },
      ],
    }
  }

  return null
})

const previewPlaceholder = computed(() => {
  if (mode.value === 'market' || mode.value === 'own-rate') {
    return 'Сначала отметьте услуги в составе работ. Как только смета появится, справа покажем ожидаемую стоимость, часы и рекомендуемый диапазон.'
  }
  return 'Введите проект, объём и сумму клиента. После этого справа появится быстрый рыночный ориентир.'
})

function onSubmit() {
  if (mode.value === 'market') {
    if (services.value.selectedIds.length === 0) {
      toast.add({ title: 'Выберите услуги', description: 'Отметьте хотя бы одну услугу из списка', color: 'error' })
      return
    }
    const result = calculateMarketResult({ grade: grade.value, buffer: buffer.value, services: services.value })
    store.setModeResult(result)
    router.push('/result')
    return
  }

  if (mode.value === 'own-rate') {
    if (!hourlyRate.value || hourlyRate.value < 100) {
      toast.add({ title: 'Укажите ставку', description: 'Введите вашу часовую ставку (₽/ч)', color: 'error' })
      return
    }
    if (services.value.selectedIds.length === 0) {
      toast.add({ title: 'Выберите услуги', description: 'Отметьте хотя бы одну услугу из списка', color: 'error' })
      return
    }
    const result = calculateOwnRateResult({ hourlyRate: hourlyRate.value, buffer: buffer.value, services: services.value })
    store.setModeResult(result)
    router.push('/result')
    return
  }

  if (!quotedPrice.value || quotedPrice.value < 1000) {
    toast.add({ title: 'Укажите сумму', description: 'Введите сумму, которую назвали клиенту', color: 'error' })
    return
  }
  const result = calculateSelfCheckResult({
    quotedPrice: quotedPrice.value,
    projectType: projectType.value,
    scopeValue: scopeValue.value,
  })
  store.setModeResult(result)
  router.push('/result')
}
</script>

<style scoped>
.slider-track-wrap {
  position: relative;
  height: 20px;
  display: flex;
  align-items: center;
}

.scope-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 9999px;
  background: var(--border-default);
  outline: none;
  cursor: pointer;
  transition: background 0.2s;
}

html.dark .scope-slider {
  background: var(--border-strong);
}

.scope-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--accent-bg);
  border: 2px solid var(--bg-surface);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}

.scope-slider::-webkit-slider-thumb:hover {
  transform: scale(1.15);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.22);
}

.scope-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--accent-bg);
  border: 2px solid var(--bg-surface);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
  cursor: pointer;
  transition: transform 0.15s;
}

input[type="number"] {
  -moz-appearance: textfield;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>

