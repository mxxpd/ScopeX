<script setup lang="ts">
import type { BenchmarkSource } from '~/utils/benchmarks'

defineProps<{
  summary: string
  sources: BenchmarkSource[]
  eyebrow?: string
}>()
</script>

<template>
  <section class="surface-card">
    <p class="eyebrow-label mb-2">{{ eyebrow ?? 'Откуда ориентиры' }}</p>
    <p class="page-lead text-sm">{{ summary }}</p>
    <div class="mt-3 flex flex-wrap gap-x-3 gap-y-2">
      <a
        v-for="source in sources"
        :key="source.id"
        :href="source.url"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs text-[var(--text-tertiary)] underline underline-offset-2 transition-colors hover:text-[var(--text-primary)]"
      >
        {{ source.title }}
      </a>
    </div>
  </section>
</template>
