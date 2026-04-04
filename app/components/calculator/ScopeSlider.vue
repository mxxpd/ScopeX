<template>
  <div class="space-y-3">
    <div class="flex justify-between items-baseline">
      <span class="text-sm text-gray-600">Количество экранов</span>
      <div class="flex items-baseline gap-1">
        <span class="text-3xl font-semibold text-gray-900">{{ modelValue }}</span>
        <span class="text-sm text-gray-400">/ 50</span>
      </div>
    </div>
    <div class="slider-track-wrap">
      <input
        type="range"
        min="1"
        max="50"
        :value="modelValue"
        class="scope-slider"
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
  background: #e5e7eb;
  outline: none;
  cursor: pointer;
  transition: background 0.2s;
}

html.dark .scope-slider {
  background: #333;
}

/* Thumb — webkit */
.scope-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #111827;
  border: 2px solid #ffffff;
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
  background: #111827;
  border: 2px solid #ffffff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.18);
  cursor: pointer;
  transition: transform 0.15s;
}

html.dark .scope-slider::-webkit-slider-thumb {
  background: #f0f0f0;
  border-color: #1e1e1e;
}

html.dark .scope-slider::-moz-range-thumb {
  background: #f0f0f0;
  border-color: #1e1e1e;
}
</style>
