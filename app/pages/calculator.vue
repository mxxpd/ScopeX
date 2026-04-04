<template>
  <div class="min-h-[calc(100vh-60px)] flex items-center justify-center p-8">
    <div class="w-full max-w-5xl">

      <!-- Кнопка назад + заголовок -->
      <div class="flex items-center gap-4 mb-8">
        <NuxtLink to="/" class="back-btn">
          <Icon name="arrow-left" :size="18" class="back-icon" />
        </NuxtLink>
        <h1 class="text-3xl font-semibold text-gray-900">Новый расчёт</h1>
      </div>

      <!-- Быстрый старт -->
      <div class="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
        <p class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Быстрый старт</p>
        <div class="grid grid-cols-4 gap-2">
          <PresetButtons @select="onPreset" />
        </div>
      </div>

      <!-- Двухколоночная форма -->
      <form class="grid grid-cols-2 gap-4" @submit.prevent="onSubmit">

        <!-- Левая колонка -->
        <div class="space-y-4">

          <div class="bg-white rounded-2xl border border-gray-200 p-5">
            <p class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Тип проекта</p>
            <ProjectTypeSelect v-model="formData.projectType" />
          </div>

          <div class="bg-white rounded-2xl border border-gray-200 p-5">
            <p class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Объём</p>
            <ScopeSlider v-model="formData.scopeValue" />
          </div>

          <div class="bg-white rounded-2xl border border-gray-200 p-5">
            <p class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Сложность</p>
            <ComplexityPicker v-model="formData.complexity" />
          </div>

        </div>

        <!-- Правая колонка -->
        <div class="space-y-4">

          <div class="bg-white rounded-2xl border border-gray-200 p-5">
            <p class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Правки</p>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-900">Кругов правок</p>
                <p class="text-xs text-gray-400 mt-0.5">стандартно 2–3 круга</p>
              </div>
              <div class="flex items-center gap-3">
                <button
                  type="button"
                  class="revisions-btn w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-all duration-150"
                  @click="formData.revisions = Math.max(0, formData.revisions - 1)"
                >−</button>
                <span class="text-lg font-semibold text-gray-900 w-4 text-center">{{ formData.revisions }}</span>
                <button
                  type="button"
                  class="revisions-btn w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-all duration-150"
                  @click="formData.revisions = Math.min(10, formData.revisions + 1)"
                >+</button>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl border border-gray-200 p-5">
            <p class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Дополнительно</p>
            <AddonsCheckboxes v-model="formData.addons" />
          </div>

          <button
            type="submit"
            class="primary-btn w-full py-4 rounded-2xl font-medium text-base active:scale-95"
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
