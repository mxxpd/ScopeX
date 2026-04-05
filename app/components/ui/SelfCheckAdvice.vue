<script setup lang="ts">
import { useRouter } from 'vue-router'
import { formatPrice } from '~/utils/pricing'

const props = defineProps<{
  position: 'below' | 'market' | 'above'
  marketMid: number
  quotedPrice: number
}>()

const router = useRouter()

const isLowerHalf = computed(() => props.quotedPrice < props.marketMid)
</script>

<template>
  <Transition name="hint-fade">
    <!-- Ниже рынка -->
    <div v-if="position === 'below'" class="hint-block hint-block-warning">
      <p class="hint-block-title">Ты оцениваешь себя ниже рынка</p>
      <ul class="hint-block-list">
        <li>
          <strong>Пересчитай</strong> — попробуй режим «По своей ставке» и посмотри,
          сколько выходит от твоего реального времени
        </li>
        <li>
          <strong>Подними постепенно</strong> — следующему клиенту назови на 10–15%
          больше. Если не откажется — это твоя новая ставка
        </li>
        <li>
          <strong>Проверь состав</strong> — возможно, ты забыл включить правки,
          созвоны или подготовку к презентации
        </li>
      </ul>
      <button
        type="button"
        class="self-check-advice-btn mt-4"
        @click="router.push('/calculator')"
      >
        Пересчитать по своей ставке →
      </button>
    </div>

    <!-- В рынке -->
    <div v-else-if="position === 'market'" class="hint-block hint-block-success">
      <p class="hint-block-title hint-block-success-title">Ты в рынке</p>
      <p class="hint-block-body mb-3">
        {{ isLowerHalf
          ? 'Нижняя половина диапазона — есть куда расти'
          : 'Верхняя половина диапазона — хорошая позиция' }}
      </p>
      <p class="hint-block-body">
        Чтобы обосновать цену клиенту — сформируй КП с разбивкой по позициям.
        Клиент видит за что платит — меньше вопросов.
      </p>
      <button
        type="button"
        class="self-check-advice-btn self-check-advice-btn-success mt-4"
        @click="router.push('/proposal')"
      >
        Сформировать КП →
      </button>
    </div>

    <!-- Выше рынка -->
    <div v-else-if="position === 'above'" class="hint-block hint-block-warning">
      <p class="hint-block-title">Твоя цена выше рынка</p>
      <ul class="hint-block-list">
        <li>
          <strong>Это нормально</strong> — если у тебя сильное портфолио,
          узкая специализация или ты работаешь с определённым типом клиентов
        </li>
        <li>
          <strong>Обоснуй цену</strong> — клиент должен понять, за что платит больше.
          Используй КП с расширенным обоснованием
        </li>
        <li>
          <strong>Проверь себя</strong> — если это первый проект в новой нише,
          возможно, стоит начать ближе к рынку
        </li>
      </ul>
      <button
        type="button"
        class="self-check-advice-btn mt-4"
        @click="router.push('/proposal?format=extended')"
      >
        Сформировать КП с обоснованием →
      </button>
    </div>
  </Transition>
</template>
