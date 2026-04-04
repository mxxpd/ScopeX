<template>
  <div class="grid grid-cols-3 gap-2">
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      class="py-2.5 px-3 rounded-xl border text-sm text-center transition-all duration-150"
      :class="modelValue === opt.value ? 'sec-active' : 'sec-idle'"
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
