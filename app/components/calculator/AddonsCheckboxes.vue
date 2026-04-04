<template>
  <div class="space-y-0.5">
    <label
      v-for="addon in addons"
      :key="addon.key"
      class="addon-row"
      :class="{ 'addon-active': modelValue[addon.key], 'addon-urgent': addon.key === 'urgent' }"
    >
      <input
        type="checkbox"
        class="sr-only"
        :checked="modelValue[addon.key]"
        @change="toggle(addon.key)"
      >
      <span class="addon-box">
        <svg
          v-if="modelValue[addon.key]"
          width="10" height="8" viewBox="0 0 10 8" fill="none"
          class="checkmark"
        >
          <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
      <span class="addon-label">{{ addon.label }}</span>
    </label>
  </div>
</template>

<script setup lang="ts">
import type { Addons } from '~/types'

const props = defineProps<{ modelValue: Addons }>()
const emit = defineEmits<{ 'update:modelValue': [value: Addons] }>()

const addons: { key: keyof Addons; label: string }[] = [
  { key: 'research', label: 'Исследование' },
  { key: 'prototype', label: 'Прототип' },
  { key: 'designSystem', label: 'Дизайн-система' },
  { key: 'adaptive', label: 'Адаптив' },
  { key: 'copywriting', label: 'Копирайтинг' },
  { key: 'devHandoff', label: 'Передача в разработку' },
  { key: 'urgent', label: 'Срочно' },
]

function toggle(key: keyof Addons) {
  emit('update:modelValue', { ...props.modelValue, [key]: !props.modelValue[key] })
}
</script>
