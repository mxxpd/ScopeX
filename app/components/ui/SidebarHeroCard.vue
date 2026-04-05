<script setup lang="ts">
defineProps<{
  eyebrow: string
  title: string
  subtitle?: string
  caption?: string
}>()
</script>

<template>
  <div class="surface-card-hero surface-card-floating">
    <div class="surface-card-brand">
      <p class="eyebrow-label text-[var(--text-brand-secondary)]">{{ eyebrow }}</p>
      <div class="mt-3 text-[2rem] font-semibold leading-none text-[var(--text-brand-primary)] sm:text-[2.5rem]">
        {{ title }}
      </div>
      <p v-if="subtitle" class="mt-3 text-sm leading-relaxed text-[var(--text-brand-secondary)]">
        {{ subtitle }}
      </p>
      <p v-if="caption" class="mt-1 text-xs text-[var(--text-brand-secondary)]">
        {{ caption }}
      </p>
    </div>
    <slot />
  </div>
</template>
