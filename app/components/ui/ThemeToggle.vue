<template>
  <div class="toggle" @click="toggleDark()">
    <span class="icon icon-sun"><Icon name="sun" :size="15" /></span>
    <span class="icon icon-moon"><Icon name="moon" :size="13" /></span>
    <div class="thumb" :style="{ transform: thumbTransform }" />
  </div>
</template>

<script setup lang="ts">
const { isDark, toggleDark } = useTheme()

const isMounted = ref(false)

const thumbTransform = computed(() => {
  if (!isMounted.value) {
    return 'translateX(0px)'
  }

  return isDark.value ? 'translateX(32px)' : 'translateX(0px)'
})

onMounted(() => {
  isMounted.value = true
})
</script>

<style scoped>
.toggle {
  position: relative;
  width: 58px;
  height: 26px;
  border-radius: 9999px;
  cursor: pointer;
  flex-shrink: 0;
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  transition: background 0.3s, border-color 0.3s;
}

html.dark .toggle {
  background: var(--bg-surface-raised);
  border-color: var(--border-strong);
}

.icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  transition: opacity 0.25s;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
}

html.dark .icon { color: var(--text-secondary); }

.icon-sun  { left: 6px;  opacity: 0; }
.icon-moon { right: 6px; opacity: 1; }

html.dark .icon-sun  { opacity: 1; }
html.dark .icon-moon { opacity: 0; }

.thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--bg-inverse);
  border: none;
  box-shadow: none;
  transition: transform 0.32s cubic-bezier(0.34, 1.4, 0.64, 1) !important;
  will-change: transform;
}

html.dark .thumb {
  background: var(--bg-inverse);
}
</style>
