<template>
  <div class="bg-[var(--bg-page)] flex flex-col min-h-screen">

    <!-- Хедер -->
    <header class="relative lg:sticky lg:top-0 z-50 bg-[var(--bg-surface)] border-b border-[var(--border-default)] h-[60px] flex items-center">
      <div class="w-full flex justify-between items-center px-4 sm:px-6 md:pl-8 md:pr-10 lg:px-12">
        <NuxtLink to="/" class="text-lg font-semibold text-[var(--text-primary)]">Scope<span class="text-[var(--text-tertiary)]">X</span></NuxtLink>

        <div class="flex items-center gap-2 sm:gap-3 lg:gap-4">
          <ThemeToggle />
          <a
            href="https://boosty.to/"
            target="_blank"
            class="support-cta hidden md:flex lg:hidden items-center gap-2 text-sm font-medium px-3 py-2 rounded-xl"
          >
            <Icon name="heart" :size="14" />
            Поддержать
          </a>
          <a
            href="https://boosty.to/"
            target="_blank"
            class="support-cta hidden lg:flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl"
          >
            <Icon name="heart" :size="14" />
            Поддержать проект
          </a>
        </div>
      </div>
    </header>

    <!-- Контент -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Футер -->
    <footer class="border-t border-[var(--border-default)] bg-[var(--bg-surface)]">
      <div class="w-full px-4 sm:px-6 lg:px-12 py-6 flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <span class="text-sm font-semibold text-[var(--text-primary)]">Scope<span class="text-[var(--text-tertiary)]">X</span></span>
        <p class="text-xs text-[var(--text-secondary)]">Сделано дизайнером для дизайнеров · 2026</p>
        <a
          href="https://boosty.to/parmenov.dsgn"
          target="_blank"
          class="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          Поддержать проект ↗
        </a>
      </div>
    </footer>

  </div>
</template>
