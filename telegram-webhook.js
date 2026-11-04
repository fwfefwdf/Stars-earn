// Telegram webhook: отвечает на pre_checkout_query.
// Подписки и пользователей в базу не записывает.
exports.handler = async function (event) {
  const token = process.env.BOT_TOKEN;
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!token || !secret) return { statusCode: 500, body: 'Server is not configured' };

  if (event.headers['x-telegram-bot-api-secret-token'] !== secret) {
    return { statusCode: 401, body: 'Unauthorized' };
  }

  let update;
  try { update = JSON.parse(event.body || '{}'); }
  catch { return { statusCode: 400, body: 'Bad JSON' }; }

  if (update.pre_checkout_query) {
    const queryId = update.pre_checkout_query.id;
    const response = await fetch(`https://api.telegram.org/bot${token}/answerPreCheckoutQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pre_checkout_query_id: queryId, ok: true })
    });
    if (!response.ok) return { statusCode: 502, body: 'Could not answer pre-checkout query' };
  }

  // successful_payment приходит после успешной оплаты/продления.
  // Намеренно ничего не сохраняем: по запросу владельца база подписок не используется.
  return { statusCode: 200, body: 'OK' };
};
