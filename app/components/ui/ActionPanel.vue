<script setup lang="ts">
defineProps<{
  eyebrow: string
  description: string
}>()
</script>

<template>
  <div class="surface-card">
    <p class="eyebrow-label mb-3">{{ eyebrow }}</p>
    <p class="page-lead text-sm">{{ description }}</p>
    <slot />
  </div>
</template>
