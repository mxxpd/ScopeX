<template>
  <div v-if="result">
    <div class="min-h-[calc(100vh-60px)] flex items-start justify-center p-4 sm:p-6 lg:p-8">
      <div class="w-full max-w-5xl">

      <!-- Кнопка назад + заголовок -->
      <div class="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <NuxtLink to="/calculator" class="back-btn">
          <Icon name="arrow-left" :size="18" class="back-icon" />
        </NuxtLink>
        <h1 class="text-xl sm:text-2xl font-semibold text-[var(--text-primary)]">Результат расчёта</h1>
        <button
          class="w-full sm:w-auto sm:ml-auto flex items-center justify-center gap-2 px-4 h-10 sm:h-9 rounded-xl text-sm transition-all
            border border-[var(--border-default)] text-[var(--text-tertiary)]
            hover:border-[var(--border-strong)] hover:text-[var(--text-secondary)]"
          @click="router.push('/calculator')"
        >
          Пересчитать
        </button>
      </div>

      <!-- Двухколоночный layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-stretch">

        <!-- ЛЕВАЯ КОЛОНКА — ЧЕК -->
        <div class="bg-[var(--bg-surface)] rounded-3xl overflow-hidden border border-[var(--border-default)]">

          <!-- Шапка чека -->
          <div class="px-5 sm:px-8 py-5 sm:py-6 border-b border-[var(--border-brand)]" style="background: var(--bg-brand-card);">
            <p class="text-xs text-[var(--text-brand-secondary)] uppercase tracking-widest mb-3">
              ScopeX · Расчёт стоимости
            </p>
            <div class="text-4xl sm:text-5xl font-semibold text-[var(--text-brand-primary)] mb-1">
              {{ formatPrice(result.finalPrice) }}
            </div>
            <div class="text-sm text-[var(--text-brand-secondary)] mt-2">
              {{ formatPrice(result.minPrice) }} — {{ formatPrice(result.maxPrice) }}
            </div>
          </div>

          <!-- Перфорированная линия -->
          <div class="relative h-6 bg-[var(--bg-page)]">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t-2 border-dashed border-[var(--border-default)]" />
            </div>
            <div class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[var(--bg-page)] border border-[var(--border-default)]" />
            <div class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 rounded-full bg-[var(--bg-page)] border border-[var(--border-default)]" />
          </div>

          <!-- Тело чека -->
          <div class="px-5 sm:px-8 py-5 sm:py-6 bg-[var(--bg-surface)] lg:min-h-[320px]">

            <!-- Мета-инфо -->
            <div class="flex justify-between text-xs text-[var(--text-tertiary)] mb-5 pb-4 border-b border-dashed border-[var(--border-default)]">
              <span>{{ projectTypeLabel }}</span>
              <span>Срок: {{ result.weeks.min }}–{{ result.weeks.max }} нед.</span>
            </div>

            <!-- Позиции -->
            <div class="space-y-3 mb-5 lg:overflow-y-auto lg:max-h-[180px] lg:min-h-[180px]">
              <div
                v-for="item in result.breakdown"
                :key="item.label"
                class="flex items-start justify-between gap-4 cursor-pointer group"
                @click="expandedItem = expandedItem === item.label ? null : item.label"
              >
                <div class="flex-1">
                  <div class="flex items-center gap-1.5">
                    <span class="text-sm text-[var(--text-secondary)]">{{ item.label }}</span>
                    <span
                      class="text-[var(--border-strong)] text-xs transition-transform duration-150"
                      :class="expandedItem === item.label ? 'rotate-180' : ''"
                    >▾</span>
                  </div>
                  <transition name="expand">
                    <p v-show="expandedItem === item.label" class="text-xs text-[var(--text-tertiary)] mt-1 leading-relaxed">
                      {{ item.explanation }}
                    </p>
                  </transition>
                </div>
                <span class="text-sm font-medium text-[var(--text-primary)] flex-shrink-0">
                  {{ formatPrice(item.amount) }}
                </span>
              </div>
            </div>

            <!-- Минимум -->
            <div v-if="minimumApplied" class="border-t border-dashed border-[var(--border-default)] pt-4 mt-4">
              <div class="flex justify-between items-center">
                <p class="text-xs text-[var(--text-tertiary)]">Применён минимум проекта</p>
                <span class="text-xs text-[var(--text-tertiary)]">{{ formatPrice(result.finalPrice) }}</span>
              </div>
            </div>

            <!-- Итого -->
            <div class="border-t-2 border-[var(--text-primary)] mt-5 pt-4 flex justify-between items-center">
              <span class="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wide">Итого</span>
              <span class="text-xl font-semibold text-[var(--text-primary)]">{{ formatPrice(result.finalPrice) }}</span>
            </div>

            <!-- Скопировать цену -->
            <button
              class="w-full mt-4 py-2.5 rounded-xl text-sm transition-all
                bg-[var(--bg-surface)] border border-[var(--border-default)]
                text-[var(--text-secondary)]
                hover:border-[var(--border-strong)]
                hover:text-[var(--text-primary)]"
              @click="copyPrice"
            >
              {{ priceCopied ? 'Скопировано ✓' : 'Скопировать цену' }}
            </button>

          </div>
        </div>

        <!-- ПРАВАЯ КОЛОНКА — ТЕКСТ КЛИЕНТУ -->
        <div class="flex flex-col gap-3">

          <!-- Заголовок + табы -->
          <div>
            <p class="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide mb-2">Текст для клиента</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tab in tabs"
                :key="tab.value"
                class="client-tab px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 outline-none ring-0 focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                style="-webkit-tap-highlight-color: transparent;"
                :class="activeTab === tab.value
                  ? 'bg-[var(--accent-bg)] text-[var(--accent-on)]'
                  : 'bg-transparent border border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]'"
                @click="activeTab = tab.value"
              >
                {{ tab.label }}
              </button>
            </div>
          </div>

          <!-- Текст -->
          <div class="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-default)] p-4 sm:p-5 flex-1 overflow-y-auto min-h-[220px] lg:min-h-0">
            <p class="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
              {{ proposalText }}
            </p>
          </div>

          <!-- Кнопки + подпись -->
          <div class="space-y-2">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                class="w-full py-3.5 rounded-2xl font-medium text-base transition-all
                  bg-[var(--bg-surface)] border border-[var(--border-default)]
                  text-[var(--text-secondary)]
                  hover:border-[var(--border-strong)]
                  hover:text-[var(--text-primary)]"
                @click="copyProposal"
              >
                {{ textCopied ? 'Скопировано ✓' : 'Скопировать текст' }}
              </button>
              <button
                class="primary-btn w-full py-3.5 rounded-2xl font-medium text-sm active:scale-95"
                @click="downloadPdf"
              >
                Скачать КП в PDF
              </button>
            </div>
            <p class="text-xs text-[var(--text-tertiary)] text-center">
              Текст включает ссылку на ScopeX — это помогает проекту развиваться
            </p>
          </div>

        </div>
      </div>
  </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { downloadProposalPdf } from '~/utils/proposal-pdf'
import { generateProposal } from '~/utils/proposal'
import { formatPrice } from '~/utils/pricing'
import type { ProposalMode } from '~/types'

definePageMeta({ middleware: 'require-form' })

const store = useCalculatorStore()
const result = computed(() => store.result)
const router = useRouter()

const { copy } = useClipboard()

// Копирование цены
const priceCopied = ref(false)
function copyPrice() {
  if (!result.value) return
  copy(formatPrice(result.value.finalPrice))
  priceCopied.value = true
  setTimeout(() => priceCopied.value = false, 2000)
}

// Скачать PDF
async function downloadPdf() {
  if (import.meta.server) return
  if (!result.value) return
  await downloadProposalPdf(result.value)
}

// Копирование текста
const textCopied = ref(false)
function copyProposal() {
  if (!result.value) return
  copy(proposalText.value)
  textCopied.value = true
  setTimeout(() => textCopied.value = false, 2000)
}

// Табы
const activeTab = ref<ProposalMode>('short')
const proposalText = computed(() => {
  if (!result.value) return ''
  return generateProposal(result.value, activeTab.value)
})

const tabs: { value: ProposalMode; label: string }[] = [
  { value: 'short', label: 'Коротко' },
  { value: 'standard', label: 'Стандарт' },
  { value: 'extended', label: 'С продажей' },
]

// Разбивка
const expandedItem = ref<string | null>(null)

const breakdownTotal = computed(() =>
  result.value?.breakdown.reduce((sum, i) => sum + i.amount, 0) ?? 0
)
const minimumApplied = computed(() =>
  result.value ? result.value.finalPrice > breakdownTotal.value : false
)

// Тип проекта
const PROJECT_TYPE_LABELS: Record<string, string> = {
  landing: 'Лендинг',
  corporate: 'Корпоративный сайт',
  ecommerce: 'Интернет-магазин',
  mobile: 'Мобильное приложение',
  presentation: 'Презентация',
  branding: 'Брендинг',
}
const projectTypeLabel = computed(() =>
  result.value
    ? (PROJECT_TYPE_LABELS[result.value.formData.projectType] ?? result.value.formData.projectType)
    : ''
)
</script>

<style scoped>
.client-tab,
.client-tab:hover,
.client-tab:focus,
.client-tab:focus-visible,
.client-tab:active {
  outline: none;
  box-shadow: none;
}
</style>
