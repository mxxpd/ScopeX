<template>
  <div class="grid grid-cols-3 gap-2">
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      class="min-h-[48px] py-2.5 px-3 rounded-xl border text-sm text-center transition-all duration-150 flex items-center justify-center leading-snug"
      :class="modelValue === opt.value
        ? 'bg-[var(--accent-subtle-bg)] border-[var(--accent-subtle-border)] text-[var(--accent-subtle-on)] font-medium'
        : 'bg-[var(--bg-surface)] border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-raised)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]'"
      @click="$emit('update:modelValue', opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Complexity } from '~/types'

defineProps<{ modelValue: Complexity }>()
defineEmits<{ 'update:modelValue': [value: Complexity] }>()

const options: { value: Complexity; label: string }[] = [
  { value: 'basic', label: 'Просто' },
  { value: 'standard', label: 'Стандарт' },
  { value: 'advanced', label: 'Сложно' },
]
</script>
