<template>
  <div class="min-h-[calc(100vh-60px)] px-5 pb-10 pt-5 sm:px-8 sm:pb-12 sm:pt-6 xl:px-20">
    <div class="page-shell section-stack">
      <PageIntro
        back-to="/result"
        title="КП для клиента"
        subtitle="Готовый текст для отправки клиенту с разбивкой по выбранной смете."
      />

      <div class="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_27rem] xl:gap-8">
        <div class="section-stack">
          <div class="surface-card">
            <SectionHeader
              eyebrow="Формат текста"
              title="Сформированное КП"
              description="Переключайтесь между кратким, email и расширенным вариантом, не покидая страницу."
              compact
            />
          </div>

          <div class="surface-card">
            <div>
              <p class="eyebrow-label mb-2">Формат текста</p>
              <SegmentedControl v-model="proposalMode" :items="proposalModes" compact :full-width="false" />
            </div>

            <div class="surface-card-raised mt-4 p-4 sm:p-5">
              <p class="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">{{ proposalText }}</p>
            </div>
          </div>
        </div>

        <aside class="sticky-sidebar space-y-4">
          <SidebarHeroCard
            eyebrow="КП для клиента"
            :title="proposalModeLabel"
            :subtitle="proposalSummary"
          >
            <div class="space-y-3 px-5 py-5 sm:px-6">
              <button
                class="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] py-3.5 text-base font-medium text-[var(--text-secondary)] transition-all hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                @click="copyProposal"
              >
                {{ proposalCopied ? 'Скопировано ✓' : 'Скопировать текст' }}
              </button>
              <button
                class="w-full cursor-not-allowed rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface-raised)] py-3.5 text-base font-medium text-[var(--text-tertiary)] opacity-70 transition-all"
                disabled
                aria-disabled="true"
                title="PDF временно отключён"
              >
                Скачать КП в PDF
              </button>
              <p class="text-xs text-[var(--text-tertiary)]">
                PDF временно отключён. Генерация не удалена из проекта и может быть включена позже.
              </p>
            </div>
          </SidebarHeroCard>

          <div class="surface-card">
            <p class="eyebrow-label mb-4">Действия</p>
            <MetaList :items="proposalMetaItems" />
          </div>

          <ServiceBreakdownBlock
            eyebrow="Что вошло в КП"
            :items="detailedModeResult?.serviceBreakdown ?? []"
          />
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import type { ProposalMode } from '~/types'
import { generateModeProposal } from '~/utils/mode-proposal'

definePageMeta({ middleware: 'require-form' })

const store = useCalculatorStore()
const modeResult = computed(() => store.modeResult)
const router = useRouter()
const { copy } = useClipboard()

const detailedModeResult = computed(() => (
  modeResult.value?.mode === 'market' || modeResult.value?.mode === 'own-rate'
    ? modeResult.value
    : null
))

watchEffect(() => {
  if (!detailedModeResult.value) {
    router.replace('/result')
  }
})

const proposalModes: { value: ProposalMode; label: string }[] = [
  { value: 'short', label: 'Telegram' },
  { value: 'standard', label: 'Email' },
  { value: 'extended', label: 'С обоснованием' },
]

const proposalMode = ref<ProposalMode>('short')
const proposalCopied = ref(false)

const proposalText = computed(() => (
  detailedModeResult.value ? generateModeProposal(detailedModeResult.value, proposalMode.value) : ''
))

const proposalModeLabel = computed(() => {
  if (proposalMode.value === 'short') return 'Telegram'
  if (proposalMode.value === 'standard') return 'Email'
  return 'С обоснованием'
})

const resultModeLabel = computed(() => {
  if (detailedModeResult.value?.mode === 'market') return 'По рынку'
  if (detailedModeResult.value?.mode === 'own-rate') return 'По своей ставке'
  return ''
})
const proposalMetaItems = computed(() => ([
  { label: 'Услуг в КП', value: detailedModeResult.value?.serviceBreakdown.length ?? 0 },
  { label: 'Режим', value: resultModeLabel.value },
  { label: 'Формат', value: proposalModeLabel.value },
]))

const proposalSummary = computed(() => {
  if (proposalMode.value === 'short') return 'Короткая версия для быстрого сообщения клиенту.'
  if (proposalMode.value === 'standard') return 'Более деловой формат для письма или коммерческого сообщения.'
  return 'Расширенная версия с объяснением ценности каждого блока работ.'
})

function copyProposal() {
  if (!proposalText.value) return
  copy(proposalText.value)
  proposalCopied.value = true
  setTimeout(() => {
    proposalCopied.value = false
  }, 2000)
}
</script>



