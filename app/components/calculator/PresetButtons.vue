<template>
  <button
    v-for="preset in PRESETS"
    :key="preset.id"
    type="button"
    class="min-h-[48px] px-3 sm:px-4 py-2.5 rounded-xl border text-sm text-center transition-all duration-150 flex items-center justify-center leading-snug"
    :class="activePreset === preset.id
      ? 'bg-[var(--accent-subtle-bg)] border-[var(--accent-subtle-border)] text-[var(--accent-subtle-on)] font-medium'
      : 'bg-[var(--bg-surface)] border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-raised)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]'"
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
