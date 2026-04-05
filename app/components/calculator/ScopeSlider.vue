<template>
  <div class="space-y-3">
    <div class="flex items-end justify-between gap-4">
      <span class="text-sm text-[var(--text-secondary)]">Количество экранов</span>
      <div class="flex items-baseline gap-1 flex-shrink-0">
        <span class="text-3xl font-semibold text-[var(--text-primary)]">{{ modelValue }}</span>
        <span class="text-sm text-[var(--text-tertiary)]">/ 50</span>
      </div>
    </div>
    <div class="slider-track-wrap">
      <input
        type="range"
        min="1"
        max="50"
        :value="modelValue"
        class="scope-slider"
        :style="{ accentColor: 'var(--accent-bg)' }"
        @input="$emit('update:modelValue', +($event.target as HTMLInputElement).value)"
      >
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ modelValue: number }>()
defineEmits<{ 'update:modelValue': [value: number] }>()
</script>

<style scoped>
.slider-track-wrap {
  position: relative;
  height: 20px;
  display: flex;
  align-items: center;
}

.scope-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 9999px;
  background: var(--border-default);
  outline: none;
  cursor: pointer;
  transition: background 0.2s;
}

html.dark .scope-slider {
  background: var(--border-strong);
}

/* Thumb — webkit */
.scope-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--accent-bg);
  border: 2px solid var(--bg-surface);
  box-shadow: 0 1px 4px rgba(0,0,0,0.18);
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}

.scope-slider::-webkit-slider-thumb:hover {
  transform: scale(1.15);
  box-shadow: 0 2px 8px rgba(0,0,0,0.22);
}

/* Thumb — firefox */
.scope-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--accent-bg);
  border: 2px solid var(--bg-surface);
  box-shadow: 0 1px 4px rgba(0,0,0,0.18);
  cursor: pointer;
  transition: transform 0.15s;
}
</style>
