<script setup lang="ts">
type SegmentedItem = {
  label: string
  value: string
}

const props = withDefaults(defineProps<{
  modelValue: string
  items: SegmentedItem[]
  compact?: boolean
  fullWidth?: boolean
}>(), {
  compact: false,
  fullWidth: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const panelClass = computed(() => props.compact ? 'p-0 border-0 bg-transparent max-w-none' : '')
const gridClass = computed(() => props.fullWidth ? '' : 'flex-wrap')
const chipClass = computed(() => props.compact ? '!flex-none px-4' : '')

function selectValue(value: string) {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="segmented-panel" :class="panelClass">
    <div class="segmented-panel-grid" :class="gridClass">
      <button
        v-for="item in items"
        :key="item.value"
        type="button"
        class="mode-chip"
        :class="[modelValue === item.value ? 'mode-chip-active' : 'mode-chip-idle', chipClass]"
        @click="selectValue(item.value)"
      >
        {{ item.label }}
      </button>
    </div>
  </div>
</template>
