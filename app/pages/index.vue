<template>
  <div>

    <!-- Hero -->
    <section>
      <div class="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 md:grid-cols-2 gap-20 items-center py-10">

        <!-- Левая колонка -->
        <div>
          <div class="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-xs text-gray-500 font-medium mb-6">
            Калькулятор для дизайнера-фрилансера
          </div>

          <h1 class="text-3xl md:text-5xl font-semibold text-gray-900 leading-tight mb-6">
            Рассчитай стоимость<br>дизайна за минуту
          </h1>

          <p class="text-lg text-gray-500 leading-relaxed mb-6 max-w-md">
            Клиент спрашивает «сколько стоит?» —
            ты отвечаешь через минуту с разбивкой
            и готовым текстом.
          </p>

          <div class="space-y-3 mb-10">
            <div class="flex items-center gap-3 text-sm text-gray-600">
              <span class="bullet-wrap flex-shrink-0"><Icon name="bill-list" :size="18" class="bullet-icon" /></span>
              <span>Цена за пару минут, вместо «подумаю, напишу»</span>
            </div>
            <div class="flex items-center gap-3 text-sm text-gray-600">
              <span class="bullet-wrap flex-shrink-0"><Icon name="variants" :size="18" class="bullet-icon" /></span>
              <span>Три варианта текста: коротко, деловой, с продажей</span>
            </div>
            <div class="flex items-center gap-3 text-sm text-gray-600">
              <span class="bullet-wrap flex-shrink-0"><Icon name="smile-square" :size="18" class="bullet-icon" /></span>
              <span>Разбивка по позициям — клиент видит за что платит</span>
            </div>
          </div>

          <NuxtLink
            to="/calculator"
            class="primary-btn inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-medium text-base active:scale-95"
          >
            Рассчитать стоимость
            <Icon name="arrow-right-up" :size="16" />
          </NuxtLink>
          <p class="text-xs text-gray-400 mt-4">Бесплатно · Без регистрации</p>
        </div>

        <!-- Правая колонка — коллаж из трёх карточек -->
        <div
          class="relative hidden md:flex items-center justify-center"
          style="height: 640px; width: 560px;"
        >

          <!-- Карточка 1 — большая, по центру слева, основа композиции -->
          <div
            class="absolute bg-white rounded-3xl p-8 shadow-lg border border-gray-100"
            style="width: 400px; left: 0; top: 50%; transform: translateY(-50%) rotate(-1.5deg); z-index: 10;"
          >
            <p class="text-xs text-gray-400 uppercase tracking-wide mb-3">Рекомендуемая стоимость</p>
            <p class="text-5xl font-semibold text-gray-900 mb-1">85 000 ₽</p>
            <p class="text-base text-gray-400 mb-1">72 000 — 98 000 ₽</p>
            <p class="text-base text-gray-500 mb-6">Срок: 3–4 недели</p>
            <div class="border-t border-gray-100 pt-5 space-y-3">
              <div class="flex justify-between text-base">
                <span class="text-gray-500">UI дизайн (8 экранов)</span>
                <span class="font-medium text-gray-900">56 000 ₽</span>
              </div>
              <div class="flex justify-between text-base">
                <span class="text-gray-500">Адаптив</span>
                <span class="font-medium text-gray-900">11 000 ₽</span>
              </div>
              <div class="flex justify-between text-base">
                <span class="text-gray-500">Правки (2 круга)</span>
                <span class="font-medium text-gray-900">6 000 ₽</span>
              </div>
            </div>
          </div>

          <!-- Карточка 2 — текст клиенту, заезжает сверху-справа -->
          <div
            class="absolute bg-white rounded-2xl p-5 shadow-xl border border-gray-100"
            style="width: 270px; right: 0; top: 28px; transform: rotate(2deg); z-index: 30;"
          >
            <p class="text-xs text-gray-400 uppercase tracking-wide mb-3">Текст для клиента</p>
            <div class="bg-gray-50 rounded-xl p-4 mb-4">
              <p class="text-sm text-gray-700 leading-relaxed italic">
                "Лендинг — 85 000 ₽, срок 3 недели.
                Включает адаптив и 2 круга правок."
              </p>
            </div>
            <div class="card-copy-btn bg-gray-900 text-white text-sm text-center py-2.5 rounded-xl font-medium flex items-center justify-center gap-1.5">
              Скопировать <Icon name="arrow-right-up" :size="14" />
            </div>
          </div>

          <!-- Карточка 3 — варианты, заезжает снизу-справа -->
          <div
            class="absolute bg-gray-900 rounded-2xl p-5 shadow-xl"
            style="width: 250px; right: 14px; bottom: 28px; transform: rotate(-1deg); z-index: 30;"
          >
            <p class="text-xs text-gray-500 uppercase tracking-wide mb-4">Варианты текста</p>
            <div class="space-y-2">
              <div class="bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-white font-medium flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                Коротко — Telegram
              </div>
              <div class="bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-400 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-gray-600 flex-shrink-0" />
                Стандарт — деловой
              </div>
              <div class="bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-400 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-gray-600 flex-shrink-0" />
                С продажей — убеждает
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>

    <!-- Divider -->
    <div class="max-w-7xl mx-auto px-8">
      <div class="border-t border-gray-200" />
    </div>

    <!-- Три шага -->
    <section class="bg-gray-50 py-14">
      <div class="max-w-7xl mx-auto px-8">
        <div class="mb-8">
          <div class="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-xs text-gray-500 font-medium mb-4">
            Как это работает
          </div>
          <h2 class="text-3xl font-semibold text-gray-900 mb-4">
            Три шага до готового ответа
          </h2>
          <p class="text-gray-500 max-w-xl leading-relaxed">
            От вопроса клиента до скопированного текста — меньше двух минут
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-300 transition-all">
            <p class="text-6xl font-semibold text-gray-100 mb-6 leading-none">01</p>
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Выбери тип и объём</h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              Лендинг, сайт, магазин или приложение.
              Пресет заполняет форму автоматически —
              укажи только что нестандартно
            </p>
          </div>
          <div class="bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-300 transition-all">
            <p class="text-6xl font-semibold text-gray-100 mb-6 leading-none">02</p>
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Получи цену и разбивку</h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              Рекомендованная цена с диапазоном и сроком.
              Каждая позиция объясняет логику —
              чтобы ты сам понимал за что берёшь деньги
            </p>
          </div>
          <div class="bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-300 transition-all">
            <p class="text-6xl font-semibold text-gray-100 mb-6 leading-none">03</p>
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Скопируй и отправь</h3>
            <p class="text-sm text-gray-500 leading-relaxed">
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
