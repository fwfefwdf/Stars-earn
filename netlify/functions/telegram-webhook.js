// Telegram webhook: отвечает на pre_checkout_query.
exports.handler = async function (event) {
  const token = process.env.BOT_TOKEN;
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  
  if (!token || !secret) {
    return { statusCode: 500, body: 'Server is not configured' };
  }

  // Проверка секретного тона от Telegram
  if (event.headers['x-telegram-bot-api-secret-token'] !== secret) {
    return { statusCode: 401, body: 'Unauthorized' };
  }

  let update;
  try {
    update = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, body: 'Bad JSON' };
  }

  // Обработка запроса перед чекаутом (самый важный момент для оплаты)
  if (update.pre_checkout_query) {
    const queryId = update.pre_checkout_query.id;

    try {
      const telegramUrl = `https://api.telegram.org/bot${token}/answerPreCheckoutQuery`;
      
      // Отправляем ответ Telegram, что всё ок
      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          pre_checkout_query_id: queryId, 
          ok: true 
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Telegram API error:', errorText);
        return { statusCode: 502, body: 'Could not answer pre-checkout query' };
      }
    } catch (err) {
      console.error('Network error during pre_checkout:', err);
      return { statusCode: 500, body: 'Internal Error' };
    }
  }

  // Если пришел успешный платеж (просто фиксируем в логах Netlify, без базы)
  if (update.message && update.message.successful_payment) {
    console.log('Payment successful received:', update.message.successful_payment);
  }

  return { statusCode: 200, body: 'OK' };
};
        
