<template>
  <button
    v-for="preset in PRESETS"
    :key="preset.id"
    type="button"
    class="px-4 py-2.5 rounded-xl border text-sm text-center transition-all duration-150"
    :class="activePreset === preset.id ? 'sec-active' : 'sec-idle'"
    @click="select(preset)"
  >
    {{ preset.name }}
  </button>
</template>

<script setup lang="ts">
import { PRESETS } from '~/utils/constants'
import type { Preset } from '~/types'

const emit = defineEmits<{ select: [preset: Preset] }>()

const activePreset = ref<string | null>(null)

function select(preset: Preset) {
  activePreset.value = preset.id
  emit('select', preset)
}
</script>
