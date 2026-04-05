<script setup lang="ts">
import type { ServiceBreakdownItem } from '~/types'
import { formatPrice } from '~/utils/pricing'

interface ServiceBreakdownGroup {
  key: string
  label: string
  items: ServiceBreakdownItem[]
}

defineProps<{
  eyebrow?: string
  description?: string
  badge?: string | number
  groups?: ServiceBreakdownGroup[]
  items?: ServiceBreakdownItem[]
}>()
</script>

<template>
  <section class="surface-card">
    <div class="mb-5 flex items-center justify-between gap-3">
      <div>
        <p class="eyebrow-label">{{ eyebrow ?? 'Состав работ' }}</p>
        <p v-if="description" class="page-lead mt-1 text-sm">{{ description }}</p>
      </div>
      <span v-if="badge !== undefined" class="metric-badge">{{ badge }}</span>
    </div>

    <div v-if="groups?.length" class="space-y-5">
      <div v-for="group in groups" :key="group.key" class="space-y-2.5">
        <p class="text-xs font-medium uppercase tracking-wide text-[var(--text-tertiary)]">{{ group.label }}</p>
        <div class="space-y-2">
          <div v-for="item in group.items" :key="item.id" class="surface-card-raised px-4 py-3">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="text-sm font-medium text-[var(--text-primary)]">{{ item.label }}</p>
                <p class="mt-1 text-xs text-[var(--text-tertiary)]">{{ item.hoursMin }}–{{ item.hoursMax }} ч</p>
              </div>
              <span class="whitespace-nowrap text-sm font-semibold text-[var(--text-primary)]">{{ formatPrice(item.price) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="space-y-2">
      <div v-for="item in items ?? []" :key="item.id" class="surface-card-raised flex items-start justify-between gap-3 px-4 py-3">
        <div class="min-w-0">
          <p class="text-sm font-medium text-[var(--text-primary)]">{{ item.label }}</p>
          <p class="mt-1 text-xs text-[var(--text-tertiary)]">{{ item.hoursMin }}–{{ item.hoursMax }} ч</p>
        </div>
        <span class="whitespace-nowrap text-sm font-semibold text-[var(--text-primary)]">{{ formatPrice(item.price) }}</span>
      </div>
    </div>
  </section>
</template>
