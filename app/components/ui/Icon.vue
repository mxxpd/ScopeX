<template>
  <span
    class="inline-flex items-center justify-center flex-shrink-0"
    :style="{ width: size + 'px', height: size + 'px' }"
    v-html="svg"
  />
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ name: string; size?: number }>(), {
  size: 20,
})

const svgFiles = import.meta.glob('../../assets/icons/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

const svg = computed(() => {
  const key = `../../assets/icons/${props.name}.svg`
  const raw = svgFiles[key] ?? ''
  // Заменяем width/height но оставляем viewBox нетронутым
  return raw
    .replace(/(<svg[^>]*)\swidth="[^"]*"/, `$1 width="${props.size}"`)
    .replace(/(<svg[^>]*)\sheight="[^"]*"/, `$1 height="${props.size}"`)
    .replace(/<svg(?![^>]*style=)([^>]*)>/, `<svg$1 style="display:block;overflow:visible">`)
})
</script>
