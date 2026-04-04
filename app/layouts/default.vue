<template>
  <div class="bg-gray-50 flex flex-col min-h-screen">

    <!-- Хедер -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-[60px] flex items-center">
      <div class="w-full flex justify-between items-center px-[60px]">
        <NuxtLink to="/" class="text-lg font-semibold text-gray-900">Scope<span class="text-gray-400">X</span></NuxtLink>

        <div class="flex items-center gap-4">
          <ThemeToggle />
          <a
            href="https://boosty.to/"
            target="_blank"
            class="hidden md:flex items-center gap-2 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-600 text-sm font-medium px-4 py-2 rounded-xl transition-all"
          >
            <Icon name="heart" :size="14" />
            Поддержать проект
          </a>
        </div>
      </div>
    </header>

    <!-- Контент -->
    <main class="flex-1 pt-[60px]">
      <slot />
    </main>

    <!-- Футер -->
    <footer class="border-t border-gray-800 bg-gray-900">
      <div class="w-full px-[60px] py-6 flex items-center justify-between">
        <span class="text-sm font-semibold text-white">Scope<span class="text-gray-500">X</span></span>
        <p class="text-xs text-gray-600">Сделано дизайнером для дизайнеров · 2026</p>
        <a
          href="https://boosty.to/parmenov.dsgn"
          target="_blank"
          class="text-xs text-gray-400 hover:text-white transition-colors"
        >
          Поддержать проект ↗
        </a>
      </div>
    </footer>

  </div>
</template>
