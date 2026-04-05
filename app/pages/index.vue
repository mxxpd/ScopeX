<template>
  <div>

    <!-- Hero -->
    <section>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)] lg:grid-cols-2 gap-8 md:gap-10 lg:gap-20 items-center py-8 sm:py-10">

        <!-- Левая колонка -->
        <div>
          <div class="relative mb-6 h-[320px] md:hidden">
            <div
              class="absolute left-0 right-10 top-12 rounded-3xl p-5 border border-[var(--border-default)] bg-[var(--bg-surface)]"
              style="box-shadow: var(--shadow-soft);"
            >
              <p class="text-[10px] text-[var(--text-tertiary)] uppercase tracking-[0.16em] mb-2">Рекомендуемая стоимость</p>
              <p class="text-3xl font-semibold text-[var(--text-primary)] mb-1">85 000 ₽</p>
              <p class="text-sm text-[var(--text-tertiary)] mb-1">72 000 — 98 000 ₽</p>
              <p class="text-sm text-[var(--text-secondary)] mb-4">Срок: 3–4 недели</p>
              <div class="border-t border-[var(--border-default)] pt-4 space-y-2 text-sm">
                <div class="flex justify-between gap-3">
                  <span class="text-[var(--text-secondary)]">UI дизайн (8 экранов)</span>
                  <span class="font-medium text-[var(--text-primary)] whitespace-nowrap">56 000 ₽</span>
                </div>
                <div class="flex justify-between gap-3">
                  <span class="text-[var(--text-secondary)]">Адаптив</span>
                  <span class="font-medium text-[var(--text-primary)] whitespace-nowrap">11 000 ₽</span>
                </div>
              </div>
            </div>

            <div
              class="absolute right-0 top-0 w-[210px] rounded-2xl p-4 border border-[var(--border-default)] bg-[var(--bg-surface)]"
              style="box-shadow: var(--shadow-strong); transform: rotate(4deg);"
            >
              <p class="text-[10px] text-[var(--text-tertiary)] uppercase tracking-[0.16em] mb-2">Текст для клиента</p>
              <div class="bg-[var(--bg-surface-raised)] rounded-xl p-3 mb-3">
                <p class="text-xs text-[var(--text-secondary)] leading-relaxed italic">
                  "Лендинг — 85 000 ₽, срок 3 недели."
                </p>
              </div>
              <div class="text-xs text-center py-2.5 rounded-xl font-medium bg-[var(--accent-bg)] text-[var(--accent-on)]">
                Скопировать
              </div>
            </div>

            <div
              class="absolute right-2 bottom-0 w-[220px] rounded-[24px] p-4 border"
              style="background: var(--bg-brand-card); border-color: var(--border-brand); box-shadow: var(--shadow-strong); transform: rotate(-2deg);"
            >
              <p class="text-[10px] text-[var(--text-brand-secondary)] uppercase tracking-[0.16em] mb-3">Варианты текста</p>
              <div class="space-y-2">
                <div class="rounded-2xl px-3.5 py-2.5 text-xs font-medium flex items-center gap-2 bg-[var(--accent-bg)] text-[var(--accent-on)]">
                  <span class="w-2 h-2 rounded-full flex-shrink-0" style="background: var(--success-dot);" />
                  Коротко — Telegram
                </div>
                <div
                  class="rounded-2xl px-3.5 py-2.5 text-xs flex items-center gap-2 border"
                  style="background: rgba(255, 255, 255, 0.34); border-color: var(--border-brand); color: var(--text-brand-secondary);"
                >
                  <span class="w-2 h-2 rounded-full flex-shrink-0" style="background: var(--text-brand-secondary);" />
                  Стандарт — деловой
                </div>
              </div>
            </div>
          </div>

          <div class="inline-flex items-center gap-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-full px-4 py-1.5 text-xs text-[var(--text-tertiary)] font-medium mb-5 sm:mb-6">
            Калькулятор для дизайнера-фрилансера
          </div>

          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] leading-tight mb-5 sm:mb-6">
            <span class="block">Рассчитай стоимость</span>
            <span class="block">дизайна за минуту</span>
          </h1>

          <p class="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-6 max-w-xl lg:max-w-md">
            Клиент спрашивает «сколько стоит?» —
            ты отвечаешь через минуту с разбивкой
            и готовым текстом.
          </p>

          <div class="space-y-3 mb-8 sm:mb-10">
            <div class="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
              <span class="feature-icon-badge">
                <Icon name="bill-list" :size="18" />
              </span>
              <span>Цена за пару минут, вместо «подумаю, напишу»</span>
            </div>
            <div class="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
              <span class="feature-icon-badge">
                <Icon name="text" :size="18" />
              </span>
              <span>Три варианта текста: коротко, деловой, с продажей</span>
            </div>
            <div class="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
              <span class="feature-icon-badge">
                <Icon name="variants" :size="18" />
              </span>
              <span>Разбивка по позициям — клиент видит за что платит</span>
            </div>
          </div>

          <NuxtLink
            to="/calculator"
            class="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-4 rounded-2xl font-medium text-base active:scale-95 transition-all
              bg-[var(--accent-bg)] text-[var(--accent-on)]
              hover:bg-[var(--accent-bg-hover)]"
          >
            Рассчитать стоимость
            <Icon name="arrow-right-up" :size="16" />
          </NuxtLink>
          <p class="text-xs text-[var(--text-tertiary)] mt-4">Бесплатно · Без регистрации</p>
        </div>

        <div class="relative hidden md:flex lg:hidden items-center justify-center self-start ml-auto mr-[-36px] h-[390px] w-full max-w-[420px] overflow-visible">
          <div
            class="absolute left-[8px] top-[84px] w-[84%] rounded-3xl p-6 border border-[var(--border-default)] bg-[var(--bg-surface)]"
            style="box-shadow: var(--shadow-soft); z-index: 10;"
          >
            <p class="text-[10px] text-[var(--text-tertiary)] uppercase tracking-[0.16em] mb-2">Рекомендуемая стоимость</p>
            <p class="text-[2rem] font-semibold text-[var(--text-primary)] mb-1">85 000 ₽</p>
            <p class="text-sm text-[var(--text-tertiary)] mb-1">72 000 — 98 000 ₽</p>
            <p class="text-sm text-[var(--text-secondary)] mb-5">Срок: 3–4 недели</p>
            <div class="border-t border-[var(--border-default)] pt-4 space-y-2.5 text-sm">
              <div class="flex justify-between gap-3">
                <span class="text-[var(--text-secondary)]">UI дизайн (8 экранов)</span>
                <span class="font-medium text-[var(--text-primary)] whitespace-nowrap">56 000 ₽</span>
              </div>
              <div class="flex justify-between gap-3">
                <span class="text-[var(--text-secondary)]">Адаптив</span>
                <span class="font-medium text-[var(--text-primary)] whitespace-nowrap">11 000 ₽</span>
              </div>
              <div class="flex justify-between gap-3">
                <span class="text-[var(--text-secondary)]">Правки (2 круга)</span>
                <span class="font-medium text-[var(--text-primary)] whitespace-nowrap">6 000 ₽</span>
              </div>
            </div>
          </div>

          <div
            class="absolute right-[-8px] top-3 w-[56%] rounded-2xl p-4 border border-[var(--border-default)] bg-[var(--bg-surface)]"
            style="box-shadow: var(--shadow-strong); z-index: 30;"
          >
            <p class="text-[10px] text-[var(--text-tertiary)] uppercase tracking-[0.16em] mb-2">Текст для клиента</p>
            <div class="bg-[var(--bg-surface-raised)] rounded-xl p-3 mb-3">
              <p class="text-xs text-[var(--text-secondary)] leading-relaxed italic">
                "Лендинг — 85 000 ₽, срок 3 недели."
              </p>
            </div>
            <div class="text-xs text-center py-2.5 rounded-xl font-medium bg-[var(--accent-bg)] text-[var(--accent-on)]">
              Скопировать
            </div>
          </div>

          <div
            class="absolute right-[-10px] bottom-[-92px] w-[66%] rounded-[24px] p-4 border"
            style="background: var(--bg-brand-card); border-color: var(--border-brand); box-shadow: var(--shadow-soft); transform: rotate(-2deg); z-index: 20;"
          >
            <p class="text-[10px] text-[var(--text-brand-secondary)] uppercase tracking-[0.16em] mb-3">Варианты текста</p>
            <div class="space-y-2">
              <div class="rounded-2xl px-3.5 py-2.5 text-xs font-medium flex items-center gap-2 bg-[var(--accent-bg)] text-[var(--accent-on)]">
                <span class="w-2 h-2 rounded-full flex-shrink-0" style="background: var(--success-dot);" />
                Коротко — Telegram
              </div>
              <div
                class="rounded-2xl px-3.5 py-2.5 text-xs flex items-center gap-2 border"
                style="background: rgba(255, 255, 255, 0.34); border-color: var(--border-brand); color: var(--text-brand-secondary);"
              >
                <span class="w-2 h-2 rounded-full flex-shrink-0" style="background: var(--text-brand-secondary);" />
                Стандарт — деловой
              </div>
              <div
                class="rounded-2xl px-3.5 py-2.5 text-xs flex items-center gap-2 border"
                style="background: rgba(255, 255, 255, 0.24); border-color: var(--border-brand); color: var(--text-brand-secondary);"
              >
                <span class="w-2 h-2 rounded-full flex-shrink-0" style="background: var(--text-brand-secondary);" />
                С продажей — убеждает
              </div>
            </div>
          </div>
        </div>

        <!-- Правая колонка — коллаж из трёх карточек -->
        <div
          class="relative hidden lg:flex items-center justify-center mx-auto"
          style="height: 640px; width: min(100%, 640px);"
        >

          <!-- Карточка 1 — большая, по центру слева, основа композиции -->
          <div
            class="absolute bg-[var(--bg-surface)] rounded-3xl p-8 border border-[var(--border-default)]"
            style="width: 404px; left: 16px; top: 170px; transform: rotate(-1.2deg); z-index: 10; box-shadow: var(--shadow-soft);"
          >
            <p class="text-xs text-[var(--text-tertiary)] uppercase tracking-wide mb-3">Рекомендуемая стоимость</p>
            <p class="text-5xl font-semibold text-[var(--text-primary)] mb-1">85 000 ₽</p>
            <p class="text-base text-[var(--text-tertiary)] mb-1">72 000 — 98 000 ₽</p>
            <p class="text-base text-[var(--text-secondary)] mb-6">Срок: 3–4 недели</p>
            <div class="border-t border-[var(--border-default)] pt-5 space-y-3">
              <div class="flex justify-between text-base">
                <span class="text-[var(--text-secondary)]">UI дизайн (8 экранов)</span>
                <span class="font-medium text-[var(--text-primary)]">56 000 ₽</span>
              </div>
              <div class="flex justify-between text-base">
                <span class="text-[var(--text-secondary)]">Адаптив</span>
                <span class="font-medium text-[var(--text-primary)]">11 000 ₽</span>
              </div>
              <div class="flex justify-between text-base">
                <span class="text-[var(--text-secondary)]">Правки (2 круга)</span>
                <span class="font-medium text-[var(--text-primary)]">6 000 ₽</span>
              </div>
            </div>
          </div>

          <!-- Карточка 2 — текст клиенту, заезжает сверху-справа -->
          <div
            class="absolute bg-[var(--bg-surface)] rounded-2xl p-5 border border-[var(--border-default)]"
            style="width: 300px; right: 18px; top: 6px; transform: rotate(0.8deg); z-index: 30; box-shadow: var(--shadow-strong);"
          >
            <p class="text-xs text-[var(--text-tertiary)] uppercase tracking-wide mb-3">Текст для клиента</p>
            <div class="bg-[var(--bg-surface-raised)] rounded-xl p-4 mb-4">
              <p class="text-sm text-[var(--text-secondary)] leading-relaxed italic">
                "Лендинг — 85 000 ₽, срок 3 недели.
                Включает адаптив и 2 круга правок."
              </p>
            </div>
            <div
              class="text-sm text-center py-2.5 rounded-xl font-medium flex items-center justify-center gap-1.5
                bg-[var(--accent-bg)] text-[var(--accent-on)]"
            >
              Скопировать <Icon name="arrow-right-up" :size="14" />
            </div>
          </div>

          <!-- Карточка 3 — варианты, заезжает снизу-справа -->
          <div
            class="absolute rounded-[28px] p-5 border"
            style="width: 344px; right: 8px; bottom: -18px; transform: rotate(-0.8deg); z-index: 30; background: var(--bg-brand-card); border-color: var(--border-brand); box-shadow: var(--shadow-strong);"
          >
            <p class="text-xs text-[var(--text-brand-secondary)] uppercase tracking-[0.14em] mb-4">Варианты текста</p>
            <div class="space-y-2">
              <div
                class="rounded-2xl px-4 py-3 text-sm font-medium flex items-center gap-2
                  bg-[var(--accent-bg)] text-[var(--accent-on)]"
              >
                <span class="w-2 h-2 rounded-full flex-shrink-0" style="background: var(--success-dot);" />
                Коротко — Telegram
              </div>
              <div
                class="rounded-2xl px-4 py-3 text-sm flex items-center gap-2 border"
                style="background: rgba(255, 255, 255, 0.38); border-color: var(--border-brand); color: var(--text-brand-secondary);"
              >
                <span class="w-2 h-2 rounded-full flex-shrink-0" style="background: var(--text-brand-secondary);" />
                Стандарт — деловой
              </div>
              <div
                class="rounded-2xl px-4 py-3 text-sm flex items-center gap-2 border"
                style="background: rgba(255, 255, 255, 0.28); border-color: var(--border-brand); color: var(--text-brand-secondary);"
              >
                <span class="w-2 h-2 rounded-full flex-shrink-0" style="background: var(--text-brand-secondary);" />
                С продажей — убеждает
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>

    <!-- Divider -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="border-t border-[var(--border-default)]" />
    </div>

    <!-- Три шага -->
    <section class="bg-[var(--bg-page)] py-12 sm:py-14">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-8">
          <div class="inline-flex items-center gap-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-full px-4 py-1.5 text-xs text-[var(--text-tertiary)] font-medium mb-4">
            Как это работает
          </div>
          <h2 class="text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] mb-4">
            Три шага до готового ответа
          </h2>
          <p class="text-[var(--text-secondary)] max-w-xl leading-relaxed">
            От вопроса клиента до скопированного текста — меньше двух минут
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          <div class="bg-[var(--bg-surface-raised)] rounded-2xl p-6 sm:p-8 border border-[var(--border-default)] hover:bg-[var(--bg-surface)] hover:border-[var(--accent-subtle-border)] transition-all md:min-h-[248px] xl:min-h-[320px]">
            <p class="text-6xl font-semibold text-[var(--border-default)] mb-6 leading-none">01</p>
            <h3 class="text-lg font-semibold text-[var(--text-primary)] mb-3">Выбери тип и объём</h3>
            <p class="text-sm text-[var(--text-secondary)] leading-relaxed">
              Лендинг, сайт, магазин или приложение.
              Пресет заполняет форму автоматически —
              укажи только что нестандартно
            </p>
          </div>
          <div class="bg-[var(--bg-surface-raised)] rounded-2xl p-6 sm:p-8 border border-[var(--border-default)] hover:bg-[var(--bg-surface)] hover:border-[var(--accent-subtle-border)] transition-all md:min-h-[248px] xl:min-h-[320px]">
            <p class="text-6xl font-semibold text-[var(--border-default)] mb-6 leading-none">02</p>
            <h3 class="text-lg font-semibold text-[var(--text-primary)] mb-3">Получи цену и разбивку</h3>
            <p class="text-sm text-[var(--text-secondary)] leading-relaxed">
              Рекомендованная цена с диапазоном и сроком.
              Каждая позиция объясняет логику —
              чтобы ты сам понимал за что берёшь деньги
            </p>
          </div>
          <div class="bg-[var(--bg-surface-raised)] rounded-2xl p-6 sm:p-8 border border-[var(--border-default)] hover:bg-[var(--bg-surface)] hover:border-[var(--accent-subtle-border)] transition-all md:min-h-[220px] xl:min-h-[320px] md:col-span-2 xl:col-span-1">
            <p class="text-6xl font-semibold text-[var(--border-default)] mb-6 leading-none">03</p>
            <h3 class="text-lg font-semibold text-[var(--text-primary)] mb-3">Скопируй и отправь</h3>
            <p class="text-sm text-[var(--text-secondary)] leading-relaxed">
              Готовый текст для клиента в один клик.
              Коротко для Telegram, деловой для email,
              расширенный — если нужно убедить
            </p>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>
