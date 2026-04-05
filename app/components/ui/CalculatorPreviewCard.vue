<script setup lang="ts">
interface PreviewLine {
  label: string
  value: string | number
  divider?: boolean
}

interface PreviewCardData {
  primary: string
  secondary: string
  metaTitle: string
  helper: string
  lines: PreviewLine[]
}

defineProps<{
  eyebrow?: string
  preview: PreviewCardData | null
  emptyTitle?: string
  emptyDescription: string
  submitLabel: string
}>()
</script>

<template>
  <div class="surface-card-hero surface-card-floating">
    <div class="surface-card-brand">
      <p class="eyebrow-label text-[var(--text-brand-secondary)]">{{ eyebrow ?? 'Ожидаемая стоимость' }}</p>
      <template v-if="preview">
        <div class="mt-3 text-[2rem] font-semibold leading-none sm:text-[2.5rem]">{{ preview.primary }}</div>
        <p class="mt-3 text-sm leading-relaxed text-[var(--text-brand-secondary)]">{{ preview.secondary }}</p>
      </template>
      <template v-else>
        <div class="mt-3 text-xl font-semibold leading-tight">{{ emptyTitle ?? 'Соберите расчёт' }}</div>
        <p class="mt-3 text-sm leading-relaxed text-[var(--text-brand-secondary)]">{{ emptyDescription }}</p>
      </template>
    </div>

    <div class="space-y-5 px-5 py-5 sm:px-6">
      <template v-if="preview">
        <div class="surface-card-raised p-4">
          <p class="eyebrow-label tracking-[0.16em]">{{ preview.metaTitle }}</p>
          <div class="mt-3">
            <MetaList :items="preview.lines" />
          </div>
        </div>
        <p class="text-sm leading-relaxed text-[var(--text-secondary)]">{{ preview.helper }}</p>
      </template>
      <template v-else>
        <div class="info-note">
          {{ emptyDescription }}
        </div>
      </template>

      <button
        type="submit"
        class="primary-btn w-full rounded-xl py-4 text-base font-medium active:scale-95"
      >
        {{ submitLabel }} →
      </button>
    </div>
  </div>
</template>
