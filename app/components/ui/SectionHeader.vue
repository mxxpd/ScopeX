<script setup lang="ts">
defineProps<{
  eyebrow: string
  title: string
  description?: string
  compact?: boolean
}>()
</script>

<template>
  <div class="section-heading">
    <p class="eyebrow-label">{{ eyebrow }}</p>
    <h2 :class="compact ? 'mt-2 text-xl font-semibold text-[var(--text-primary)]' : 'section-title'">
      {{ title }}
    </h2>
    <p v-if="description" class="page-lead mt-2 text-sm">
      {{ description }}
    </p>
  </div>
</template>
