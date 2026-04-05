<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
    <button
      v-for="type in types"
      :key="type.value"
      type="button"
      class="min-h-[48px] px-2 py-2 rounded-xl border text-xs font-medium transition-all duration-150 flex items-center justify-center text-center leading-snug"
      :class="modelValue === type.value
        ? 'bg-[var(--accent-subtle-bg)] border-[var(--accent-subtle-border)] text-[var(--accent-subtle-on)] font-medium'
        : 'bg-[var(--bg-surface)] border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-raised)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]'"
      @click="$emit('update:modelValue', type.value)"
    >
      {{ type.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { ProjectType } from '~/types'

defineProps<{ modelValue: ProjectType }>()
defineEmits<{ 'update:modelValue': [value: ProjectType] }>()

const types: { value: ProjectType; label: string }[] = [
  { value: 'landing', label: 'Лендинг' },
  { value: 'corporate', label: 'Сайт компании' },
  { value: 'ecommerce', label: 'Интернет-магазин' },
  { value: 'mobile', label: 'Мобильное приложение' },
  { value: 'presentation', label: 'Презентация' },
  { value: 'branding', label: 'Брендинг' },
]
</script>
