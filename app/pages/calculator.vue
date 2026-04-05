<template>
  <div class="min-h-[calc(100vh-60px)] flex items-start justify-center p-4 sm:p-6 lg:p-8">
    <div class="w-full max-w-5xl">

      <!-- Кнопка назад + заголовок -->
      <div class="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <NuxtLink to="/" class="back-btn">
          <Icon name="arrow-left" :size="18" class="back-icon" />
        </NuxtLink>
        <h1 class="text-2xl sm:text-3xl font-semibold text-[var(--text-primary)]">Новый расчёт</h1>
      </div>

      <!-- Быстрый старт -->
      <div class="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-default)] p-4 sm:p-5 mb-4">
        <p class="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide mb-3">Быстрый старт</p>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-2">
          <PresetButtons @select="onPreset" />
        </div>
      </div>

      <!-- Двухколоночная форма -->
      <form class="grid grid-cols-1 lg:grid-cols-2 gap-4" @submit.prevent="onSubmit">

        <!-- Левая колонка -->
        <div class="space-y-4">

          <div class="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-default)] p-4 sm:p-5">
            <p class="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide mb-3">Тип проекта</p>
            <ProjectTypeSelect v-model="formData.projectType" />
          </div>

          <div class="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-default)] p-4 sm:p-5">
            <p class="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide mb-3">Объём</p>
            <ScopeSlider v-model="formData.scopeValue" />
          </div>

          <div class="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-default)] p-4 sm:p-5">
            <p class="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide mb-3">Сложность</p>
            <ComplexityPicker v-model="formData.complexity" />
          </div>

        </div>

        <!-- Правая колонка -->
        <div class="space-y-4">

          <div class="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-default)] p-4 sm:p-5">
            <p class="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide mb-3">Правки</p>
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p class="text-sm font-medium text-[var(--text-primary)]">Кругов правок</p>
                <p class="text-xs text-[var(--text-tertiary)] mt-0.5">стандартно 2–3 круга</p>
              </div>
              <div class="flex items-center gap-3 self-end sm:self-auto">
                <button
                  type="button"
                  class="w-8 h-8 rounded-full border border-[var(--border-default)] flex items-center justify-center text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] transition-all duration-150"
                  @click="formData.revisions = Math.max(0, formData.revisions - 1)"
                >−</button>
                <span class="text-lg font-semibold text-[var(--text-primary)] w-4 text-center">{{ formData.revisions }}</span>
                <button
                  type="button"
                  class="w-8 h-8 rounded-full border border-[var(--border-default)] flex items-center justify-center text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] transition-all duration-150"
                  @click="formData.revisions = Math.min(10, formData.revisions + 1)"
                >+</button>
              </div>
            </div>
          </div>

          <div class="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-default)] p-4 sm:p-5 lg:min-h-[334px]">
            <p class="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide mb-3">Дополнительно</p>
            <AddonsCheckboxes v-model="formData.addons" />
          </div>

          <button
            type="submit"
            class="w-full py-4 rounded-2xl font-medium text-base
              active:scale-95 transition-all
              bg-[var(--accent-bg)] text-[var(--accent-on)]
              hover:bg-[var(--accent-bg-hover)]"
          >
            Рассчитать стоимость →
          </button>

        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { useCalculatorStore } from '~/stores/calculator'
import type { FormData, Preset } from '~/types'

const store = useCalculatorStore()
const router = useRouter()
const toast = useToast()

const formData = ref<FormData>({
  projectType: 'landing',
  scopeValue: 7,
  complexity: 'standard',
  revisions: 2,
  addons: {
    research: false,
    prototype: false,
    designSystem: false,
    adaptive: false,
    copywriting: false,
    devHandoff: false,
    urgent: false,
  },
})

function onPreset(preset: Preset) {
  Object.assign(formData.value, preset.formData)
}

const schema = z.object({
  projectType: z.enum(['landing', 'corporate', 'ecommerce', 'mobile', 'presentation', 'branding']),
  scopeValue: z.number().min(1).max(100),
  complexity: z.enum(['basic', 'standard', 'advanced']),
  revisions: z.number().min(0).max(10),
})

function onSubmit() {
  const result = schema.safeParse(formData.value)
  if (!result.success) {
    const message = result.error.issues[0]?.message ?? 'Проверьте заполнение формы'
    toast.add({ title: 'Ошибка', description: message, color: 'error' })
    return
  }
  store.setForm(formData.value)
  store.calculate()
  router.push('/result')
}
</script>
