<script setup lang="ts">
type MetaItem = {
  label: string
  value: string | number
  divider?: boolean
}

defineProps<{
  items: MetaItem[]
}>()
</script>

<template>
  <div class="meta-list">
    <div
      v-for="item in items"
      :key="`${item.label}-${item.value}`"
      class="meta-row"
      :class="{ 'meta-divider': item.divider }"
    >
      <span class="meta-label">{{ item.label }}</span>
      <span class="meta-value">{{ item.value }}</span>
    </div>
  </div>
</template>
