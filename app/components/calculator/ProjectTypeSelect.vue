<template>
  <div class="grid grid-cols-3 gap-2">
    <button
      v-for="type in types"
      :key="type.value"
      type="button"
      class="py-2 px-2 rounded-xl border text-xs font-medium transition-all duration-150"
      :class="modelValue === type.value ? 'sec-active' : 'sec-idle'"
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
