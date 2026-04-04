import { useDark, useToggle } from '@vueuse/core'

export function useTheme() {
  const isDark = useDark({
    selector: 'html',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: '',
    storageKey: 'scopex-theme',
    initialValue: 'auto',
  })

  const toggleDark = useToggle(isDark)

  return { isDark, toggleDark }
}
