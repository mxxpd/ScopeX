<template>
  <div v-if="result">
    <div class="min-h-[calc(100vh-60px)] flex items-center justify-center p-8">
      <div class="w-full max-w-5xl">

      <!-- Кнопка назад + заголовок -->
      <div class="flex items-center gap-4 mb-8">
        <NuxtLink to="/calculator" class="back-btn">
          <Icon name="arrow-left" :size="18" class="back-icon" />
        </NuxtLink>
        <h1 class="text-2xl font-semibold text-gray-900">Результат расчёта</h1>
        <button
          class="ml-auto flex items-center gap-2 px-4 h-9 rounded-xl border border-gray-200 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-all"
          @click="router.push('/calculator')"
        >
          Пересчитать
        </button>
      </div>

      <!-- Двухколоночный layout -->
      <div class="grid grid-cols-2 gap-6 items-stretch">

        <!-- ЛЕВАЯ КОЛОНКА — ЧЕК -->
        <div class="bg-white rounded-3xl overflow-hidden border border-gray-200">

          <!-- Шапка чека -->
          <div class="bg-gray-900 px-8 py-6">
            <p class="text-xs text-gray-400 uppercase tracking-widest mb-3">
              ScopeX · Расчёт стоимости
            </p>
            <div class="text-5xl font-semibold text-white mb-1">
              {{ formatPrice(result.finalPrice) }}
            </div>
            <div class="text-sm text-gray-400 mt-2">
              {{ formatPrice(result.minPrice) }} — {{ formatPrice(result.maxPrice) }}
            </div>
          </div>

          <!-- Перфорированная линия -->
          <div class="relative h-6 bg-gray-50">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t-2 border-dashed border-gray-200" />
            </div>
            <div class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gray-50 border border-gray-200" />
            <div class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 rounded-full bg-gray-50 border border-gray-200" />
          </div>

          <!-- Тело чека -->
          <div class="px-8 py-6 bg-white" style="min-height: 320px;">

            <!-- Мета-инфо -->
            <div class="flex justify-between text-xs text-gray-400 mb-5 pb-4 border-b border-dashed border-gray-200">
              <span>{{ projectTypeLabel }}</span>
              <span>Срок: {{ result.weeks.min }}–{{ result.weeks.max }} нед.</span>
            </div>

            <!-- Позиции -->
            <div class="space-y-3 mb-5 overflow-y-auto" style="max-height: 180px; min-height: 180px;">
              <div
                v-for="item in result.breakdown"
                :key="item.label"
                class="flex items-start justify-between gap-4 cursor-pointer group"
                @click="expandedItem = expandedItem === item.label ? null : item.label"
              >
                <div class="flex-1">
                  <div class="flex items-center gap-1.5">
                    <span class="text-sm text-gray-700">{{ item.label }}</span>
                    <span
                      class="text-gray-300 text-xs transition-transform duration-150"
                      :class="expandedItem === item.label ? 'rotate-180' : ''"
                    >▾</span>
                  </div>
                  <transition name="expand">
                    <p v-show="expandedItem === item.label" class="text-xs text-gray-400 mt-1 leading-relaxed">
                      {{ item.explanation }}
                    </p>
                  </transition>
                </div>
                <span class="text-sm font-medium text-gray-900 flex-shrink-0">
                  {{ formatPrice(item.amount) }}
                </span>
              </div>
            </div>

            <!-- Минимум -->
            <div v-if="minimumApplied" class="border-t border-dashed border-gray-200 pt-4 mt-4">
              <div class="flex justify-between items-center">
                <p class="text-xs text-gray-400">Применён минимум проекта</p>
                <span class="text-xs text-gray-400">{{ formatPrice(result.finalPrice) }}</span>
              </div>
            </div>

            <!-- Итого -->
            <div class="border-t-2 border-gray-900 mt-5 pt-4 flex justify-between items-center">
              <span class="text-sm font-semibold text-gray-900 uppercase tracking-wide">Итого</span>
              <span class="text-xl font-semibold text-gray-900">{{ formatPrice(result.finalPrice) }}</span>
            </div>

            <!-- Скопировать цену -->
            <button
              class="sec-idle w-full mt-4 py-2.5 rounded-xl border text-sm transition-all duration-150"
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
            <p class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Текст для клиента</p>
            <div class="flex gap-2">
              <button
                v-for="tab in tabs"
                :key="tab.value"
                class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150"
                :class="activeTab === tab.value ? 'sec-active' : 'sec-idle'"
                @click="activeTab = tab.value"
              >
                {{ tab.label }}
              </button>
            </div>
          </div>

          <!-- Текст -->
          <div class="bg-white rounded-2xl border border-gray-200 p-5 flex-1 overflow-y-auto" style="min-height: 0;">
            <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {{ proposalText }}
            </p>
          </div>

          <!-- Кнопки + подпись -->
          <div class="space-y-2">
            <button
              class="primary-btn w-full py-3.5 rounded-2xl font-medium text-base active:scale-95"
              @click="copyProposal"
            >
              {{ textCopied ? 'Скопировано ✓' : 'Скопировать текст' }}
            </button>
            <button
              class="sec-idle w-full py-3 rounded-2xl font-medium text-sm border transition-all"
              @click="downloadPdf"
            >
              Скачать КП в PDF
            </button>
            <p class="text-xs text-gray-400 text-center">
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
