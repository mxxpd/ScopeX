<template>
  <div class="space-y-5">

    <!-- Service groups -->
    <div v-for="group in groups" :key="group.key" class="space-y-1">
      <p class="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide mb-2">{{ group.label }}</p>

      <template v-for="service in group.services" :key="service.id">

        <!-- Service row -->
        <div
          class="flex items-start gap-3 px-3 py-2.5 rounded-lg border transition-all"
          :class="rowClass(service)"
          :style="isDisabled(service) ? 'opacity: 0.45; cursor: not-allowed;' : 'cursor: pointer;'"
          @click="!isDisabled(service) && toggle(service.id)"
        >
          <!-- Checkbox -->
          <div
            class="mt-0.5 w-4 h-4 flex-shrink-0 rounded border-2 flex items-center justify-center transition-all"
            :class="isSelected(service.id) ? 'bg-[var(--accent-bg)] border-[var(--accent-bg)]' : 'border-[var(--border-strong)] bg-transparent'"
          >
            <svg v-if="isSelected(service.id)" width="10" height="8" viewBox="0 0 10 8" fill="none" class="text-[var(--accent-on)]">
              <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>

          <!-- Label + meta -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-2 flex-wrap">
              <span class="text-sm font-medium text-[var(--text-primary)] leading-snug">{{ service.label }}</span>
              <div class="flex items-center gap-2 flex-shrink-0">
                <span class="text-xs text-[var(--text-tertiary)]">{{ hoursLabel(service.id) }}</span>
                <span v-if="rate && isSelected(service.id) && priceForService(service.id) > 0" class="text-xs font-medium text-[var(--accent-subtle-on)]">{{ formatPrice(priceForService(service.id)) }}</span>
                <!-- Tooltip -->
                <div class="relative" @click.stop>
                  <button
                    type="button"
                    class="w-4 h-4 rounded-full border border-[var(--border-default)] text-[var(--text-tertiary)] text-[10px] leading-none flex items-center justify-center hover:border-[var(--border-strong)] hover:text-[var(--text-secondary)] transition-colors"
                    @mouseenter="activeTooltip = service.id"
                    @mouseleave="activeTooltip = null"
                    @focus="activeTooltip = service.id"
                    @blur="activeTooltip = null"
                  >?</button>
                  <div
                    v-if="activeTooltip === service.id"
                    class="absolute right-0 bottom-6 z-50 w-56 p-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] text-xs text-[var(--text-secondary)] shadow-lg leading-relaxed pointer-events-none"
                  >
                    {{ service.tooltip }}
                  </div>
                </div>
              </div>
            </div>
            <!-- Modifier note when screens not selected -->
            <p v-if="service.screenModifier && !selectedSet.has('screenDesign')" class="text-xs text-[var(--text-tertiary)] mt-0.5 leading-tight">
              Требует: Дизайн экранов
            </p>
          </div>
        </div>

        <!-- Screens count slider — inline below screenDesign row -->
        <div v-if="service.id === 'screenDesign' && selectedSet.has('screenDesign')" class="ml-7 mt-1 mb-1 px-3 py-2.5 rounded-lg bg-[var(--bg-surface-raised)] border border-[var(--border-default)]">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs text-[var(--text-tertiary)]">Количество экранов</span>
            <span class="text-sm font-semibold text-[var(--text-primary)]">{{ screensCount }}</span>
          </div>
          <input
            v-model.number="screensCount"
            type="range"
            min="1"
            max="30"
            step="1"
            class="svc-slider w-full"
            :style="{ accentColor: 'var(--accent-bg)' }"
          >
          <div class="flex justify-between text-xs text-[var(--text-tertiary)] mt-1">
            <span>1 экран</span>
            <span>30 экранов</span>
          </div>
        </div>

        <!-- Revisions count — inline below revisions row -->
        <div v-if="service.id === 'revisions' && selectedSet.has('revisions')" class="ml-7 mt-1 mb-1 px-3 py-2 rounded-lg bg-[var(--bg-surface-raised)] border border-[var(--border-default)]">
          <div class="flex items-center gap-3">
            <span class="text-xs text-[var(--text-tertiary)]">Количество кругов</span>
            <div class="flex items-center gap-2 ml-auto">
              <button type="button" class="w-6 h-6 rounded-lg border border-[var(--border-default)] text-sm flex items-center justify-center hover:bg-[var(--bg-surface)] transition-colors" @click.stop="revisionsCount = Math.max(1, revisionsCount - 1)">−</button>
              <span class="text-sm font-semibold text-[var(--text-primary)] w-5 text-center">{{ revisionsCount }}</span>
              <button type="button" class="w-6 h-6 rounded-lg border border-[var(--border-default)] text-sm flex items-center justify-center hover:bg-[var(--bg-surface)] transition-colors" @click.stop="revisionsCount = Math.min(10, revisionsCount + 1)">+</button>
            </div>
          </div>
        </div>

      </template>
    </div>

    <!-- Summary -->
    <div v-if="showSummaryVisible && selectedSet.size > 0" class="pt-4 border-t border-[var(--border-default)] space-y-2">
      <div class="flex items-center justify-between">
        <span class="text-sm text-[var(--text-secondary)]">Общее время</span>
        <span class="text-sm font-semibold text-[var(--text-primary)]">{{ totalMin }}–{{ totalMax }} ч</span>
      </div>
      <template v-if="rate && rate > 0">
        <div class="flex items-center justify-between">
          <span class="text-sm text-[var(--text-secondary)]">Итоговая цена</span>
          <span class="text-sm font-semibold text-[var(--text-primary)]">{{ formatPrice(totalPrice) }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-[var(--text-secondary)]">Диапазон ±15%</span>
          <span class="text-sm font-medium text-[var(--accent-subtle-on)]">{{ formatPrice(recMin) }} — {{ formatPrice(recMax) }}</span>
        </div>
      </template>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { ServiceDef } from '~/utils/services'
import { getGroupedServices, getServiceHours, calculateTotalHours, SERVICES } from '~/utils/services'
import { formatPrice } from '~/utils/pricing'
import type { ServiceSelection } from '~/types'

const props = defineProps<{
  modelValue: ServiceSelection
  rate?: number
  showSummary?: boolean
}>()

const emit = defineEmits<{ 'update:modelValue': [value: ServiceSelection] }>()

// Internal state
const selectedSet = ref(new Set(props.modelValue.selectedIds))
const screensCount = ref(props.modelValue.screensCount)
const revisionsCount = ref(props.modelValue.revisionsCount)

watch(
  () => props.modelValue,
  (value) => {
    selectedSet.value = new Set(value.selectedIds)
    screensCount.value = value.screensCount
    revisionsCount.value = value.revisionsCount
  },
  { deep: true },
)

const groups = getGroupedServices()

function emitUpdate() {
  emit('update:modelValue', {
    selectedIds: [...selectedSet.value],
    screensCount: screensCount.value,
    revisionsCount: revisionsCount.value,
  })
}

watch([screensCount, revisionsCount], emitUpdate)

function toggle(id: string) {
  if (selectedSet.value.has(id)) {
    selectedSet.value.delete(id)
    if (id === 'screenDesign') {
      selectedSet.value.delete('adaptive')
      selectedSet.value.delete('darkMode')
    }
  }
  else {
    selectedSet.value.add(id)
  }
  emitUpdate()
}

function isSelected(id: string) {
  return selectedSet.value.has(id)
}

function isDisabled(service: ServiceDef) {
  return service.screenModifier !== undefined && !selectedSet.value.has('screenDesign')
}

function rowClass(service: ServiceDef) {
  if (isSelected(service.id)) return 'bg-[var(--accent-subtle-bg)] border-[var(--accent-subtle-border)]'
  return 'bg-[var(--bg-surface-raised)] border-transparent hover:border-[var(--border-default)]'
}

// Tooltip
const activeTooltip = ref<string | null>(null)

// Per-service hour/price helpers — use Map to avoid subscript bracket access in template
const hoursMapComputed = computed(() => {
  const sdSelected = selectedSet.value.has('screenDesign')
  const map = new Map<string, { min: number; max: number; mid: number }>()
  for (const s of SERVICES) {
    map.set(s.id, getServiceHours(s, screensCount.value, revisionsCount.value, sdSelected))
  }
  return map
})

function getHours(id: string) {
  return hoursMapComputed.value.get(id) ?? { min: 0, max: 0, mid: 0 }
}

function hoursLabel(serviceId: string): string {
  const s = SERVICES.find(x => x.id === serviceId)
  if (!s) return ''
  if (s.screenModifier !== undefined) {
    const pct = Math.round(s.screenModifier * 100)
    if (!selectedSet.value.has('screenDesign')) return '+' + pct + '%'
    const h = getHours(serviceId)
    return '+' + h.min + '–' + h.max + ' ч'
  }
  if (s.perScreen) {
    if (selectedSet.value.has(serviceId)) {
      const h = getHours(serviceId)
      return h.min + '–' + h.max + ' ч'
    }
    return s.hoursMin + '–' + s.hoursMax + ' ч/экр'
  }
  if (s.perRound) {
    if (selectedSet.value.has(serviceId)) {
      const h = getHours(serviceId)
      return h.min + '–' + h.max + ' ч'
    }
    return s.hoursMin + '–' + s.hoursMax + ' ч/круг'
  }
  return s.hoursMin + '–' + s.hoursMax + ' ч'
}

function priceForService(serviceId: string): number {
  if (!props.rate) return 0
  const h = getHours(serviceId)
  return Math.round((h.mid * props.rate) / 1000) * 1000
}

// Totals
const totalHours = computed(() =>
  calculateTotalHours([...selectedSet.value], screensCount.value, revisionsCount.value),
)
const totalMin = computed(() => totalHours.value.min)
const totalMax = computed(() => totalHours.value.max)
const totalPrice = computed(() => {
  if (!props.rate) return 0
  return Math.round((totalHours.value.mid * props.rate) / 1000) * 1000
})
const recMin = computed(() => Math.round((totalPrice.value * 0.85) / 1000) * 1000)
const recMax = computed(() => Math.round((totalPrice.value * 1.15) / 1000) * 1000)
const showSummaryVisible = computed(() => props.showSummary ?? true)
</script>

<style scoped>
.svc-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 9999px;
  background: var(--border-default);
  outline: none;
  cursor: pointer;
}

.svc-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--accent-bg);
  border: 2px solid var(--bg-surface);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
  cursor: pointer;
  transition: transform 0.15s;
}

.svc-slider::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}

.svc-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--accent-bg);
  border: 2px solid var(--bg-surface);
  cursor: pointer;
}
</style>
