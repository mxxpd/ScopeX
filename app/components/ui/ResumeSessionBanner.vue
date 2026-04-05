<script setup lang="ts">
import type { LastSession } from '~/composables/useLastSession'
import { formatPrice } from '~/utils/pricing'

const props = defineProps<{
  session: LastSession
  onResume: () => void
  onDismiss: () => void
}>()

const MODE_LABELS: Record<LastSession['mode'], string> = {
  'market': 'По рынку',
  'own-rate': 'По своей ставке',
  'self-check': 'Проверить себя',
}

function formatRelativeDate(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (diff < 60 * 60 * 1000) return 'только что'
  if (days === 1) return 'вчера'
  if (days >= 2) return `${days} ${pluralDays(days)} назад`
  if (hours >= 1) return `${hours} ${pluralHours(hours)} назад`
  return 'только что'
}

function pluralHours(n: number): string {
  if (n % 10 === 1 && n % 100 !== 11) return 'час'
  if (n % 10 >= 2 && n % 10 <= 4 && !(n % 100 >= 12 && n % 100 <= 14)) return 'часа'
  return 'часов'
}

function pluralDays(n: number): string {
  if (n % 10 === 1 && n % 100 !== 11) return 'день'
  if (n % 10 >= 2 && n % 10 <= 4 && !(n % 100 >= 12 && n % 100 <= 14)) return 'дня'
  return 'дней'
}

const modeLabel = computed(() => MODE_LABELS[props.session.mode])
const priceLabel = computed(() => formatPrice(props.session.result.totalPrice))
const dateLabel = computed(() => formatRelativeDate(props.session.savedAt))
</script>

<template>
  <div class="resume-banner">
    <div class="resume-banner-icon">
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M10 2a8 8 0 1 0 0 16A8 8 0 0 0 10 2zm0 1.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13zm0 2a.75.75 0 0 0-.75.75v4c0 .199.079.39.22.53l2.5 2.5a.75.75 0 1 0 1.06-1.06L10.75 9.69V6.25A.75.75 0 0 0 10 5.5z" fill="currentColor"/>
      </svg>
    </div>

    <div class="resume-banner-body">
      <p class="resume-banner-title">У тебя есть незавершённый расчёт</p>
      <p class="resume-banner-meta">{{ modeLabel }} · {{ priceLabel }} · {{ dateLabel }}</p>
    </div>

    <div class="resume-banner-actions">
      <button type="button" class="resume-banner-btn-primary" @click="onResume()">
        Продолжить расчёт
      </button>
      <button type="button" class="resume-banner-btn-ghost" @click="onDismiss()">
        Начать заново
      </button>
    </div>
  </div>
</template>
