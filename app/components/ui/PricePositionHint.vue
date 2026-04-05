<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { formatPrice } from '~/utils/pricing'

const props = defineProps<{
  position: 'below' | 'market' | 'above'
  marketMid: number
}>()

const copyText = `Стоимость выше средней по рынку, потому что включает [опыт / специализацию / гарантию результата]. Вы платите не за часы — а за то, что проект будет сделан правильно с первого раза.`

const { copy, copied } = useClipboard({ source: copyText })
</script>

<template>
  <Transition name="hint-fade">
    <div v-if="position === 'above'" class="hint-block hint-block-warning">
      <p class="hint-block-title">Твоя цена выше рынка — это нормально</p>
      <ul class="hint-block-list">
        <li>Опыт стоит дороже — клиент платит за предсказуемый результат, а не за часы</li>
        <li>Меньше правок — сильный дизайнер попадает в цель с первого раза</li>
        <li>Ответственность — ты ведёшь проект, а не просто рисуешь экраны</li>
      </ul>
      <div class="mt-4 rounded-xl border border-[var(--warning-border)] bg-[var(--warning-bg)] p-4">
        <p class="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--warning-on)]">Готовый текст для клиента</p>
        <p class="text-sm leading-relaxed text-[var(--warning-on)]">{{ copyText }}</p>
        <button
          type="button"
          class="mt-3 rounded-lg border border-[var(--warning-border)] px-3.5 py-1.5 text-sm font-medium text-[var(--warning-on)] transition-opacity hover:opacity-75"
          @click="copy()"
        >
          {{ copied ? 'Скопировано ✓' : 'Скопировать объяснение для клиента' }}
        </button>
      </div>
    </div>

    <div v-else-if="position === 'below'" class="hint-block hint-block-success">
      <p class="hint-block-title">Есть куда расти по цене</p>
      <p class="hint-block-body">
        Твоя цена ниже рыночной для Junior. Это нормально для старта или для проекта в портфолио.
        Рыночный ориентир для этого объёма — <strong>{{ formatPrice(marketMid) }}</strong>.
      </p>
    </div>
  </Transition>
</template>
