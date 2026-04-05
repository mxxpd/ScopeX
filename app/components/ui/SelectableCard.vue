<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  selected?: boolean
  badge?: string
  align?: 'left' | 'center'
}>()
</script>

<template>
  <div
    class="selectable-card px-4 py-4 duration-150"
    :class="[
      selected
        ? 'selectable-card-selected'
        : '',
      align === 'center' ? 'text-center' : 'text-left',
    ]"
  >
    <div class="flex items-start justify-between gap-2">
      <div class="min-w-0" :class="align === 'center' ? 'w-full' : ''">
        <p class="font-semibold">{{ title }}</p>
        <p v-if="subtitle" class="mt-1 text-xs opacity-75">{{ subtitle }}</p>
      </div>
      <span
        v-if="badge"
        class="rounded-full bg-[var(--accent-bg)] px-2 py-0.5 text-xs text-[var(--accent-on)]"
      >
        {{ badge }}
      </span>
    </div>
    <slot />
  </div>
</template>
