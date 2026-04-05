<script setup lang="ts">
defineProps<{
  backTo: string
  title: string
  subtitle?: string
  titleClass?: string
}>()
</script>

<template>
  <div class="flex flex-wrap items-center gap-3 sm:gap-4">
    <NuxtLink :to="backTo" class="back-btn">
      <Icon name="arrow-left" :size="18" class="back-icon" />
    </NuxtLink>
    <div class="min-w-0">
      <h1 :class="titleClass ?? 'text-xl font-semibold text-[var(--text-primary)] sm:text-2xl'">{{ title }}</h1>
      <p v-if="subtitle" class="mt-1 text-sm text-[var(--text-secondary)]">{{ subtitle }}</p>
    </div>
  </div>
</template>
