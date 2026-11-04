STATS EARN — нативная подписка Telegram Stars

Логика:
- Используется существующая нижняя кнопка «Тап».
- Считаются 10 последовательных нажатий.
- Интервал между соседними нажатиями должен быть не более 300 мс.
- Сразу после десятого нажатия игра запрашивает у Netlify ссылку Telegram Invoice.
- Затем вызывается Telegram WebApp.openInvoice(). Telegram открывает собственное системное окно оплаты.
- В HTML нет промежуточного окна подписки, имитации платежа или отдельной кнопки оплаты от игры.

Подписка:
- 10 Telegram Stars за месяц.
- Период: 2 592 000 секунд.
- Валюта Telegram Stars: XTR.

Файлы:
- index.html — исходная игра с изменённой логикой быстрых тапов.
- netlify/functions/create-invoice.js — создаёт настоящий recurring invoice Telegram Stars.
- netlify/functions/telegram-webhook.js — отвечает на pre_checkout_query.
- netlify.toml — конфигурация Netlify Functions.
- PNG-файлы — изображения, включённые в исходный ZIP.

Публикация:
1. Распакуй архив.
2. Загрузи содержимое папки stats_earn_ready в корень GitHub-репозитория (не саму папку).
3. В Netlify должны быть заданы BOT_TOKEN и TELEGRAM_WEBHOOK_SECRET.
4. Сделай новый Deploy.
5. Webhook бота должен вести на https://ТВОЙ-САЙТ/.netlify/functions/telegram-webhook и использовать тот же TELEGRAM_WEBHOOK_SECRET.

Важно:
- BOT_TOKEN не хранится в HTML и не включён в архив.
- Открытие нативного окна работает внутри Telegram Mini App при наличии Telegram WebApp API.
- Фактическую оплату нельзя проверить до публикации на Netlify с действительным BOT_TOKEN.
- Webhook в этом комплекте подтверждает pre_checkout_query, но не ведёт отдельную базу активных подписок.
