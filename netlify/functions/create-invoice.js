// Создаёт ежемесячный счёт Telegram Stars на 10 ⭐.
// BOT_TOKEN задаётся в Netlify → Site configuration → Environment variables.
exports.handler = async function () {
  const token = process.env.BOT_TOKEN;
  if (!token) {
    return { statusCode: 500, body: JSON.stringify({ error: 'На сервере не задан BOT_TOKEN' }) };
  }

  const payload = {
    title: 'Подписка Stats Earn',
    description: 'Ежемесячная подписка Stats Earn',
    payload: 'stats_earn_monthly_subscription',
    provider_token: '',
    currency: 'XTR',
    prices: [{ label: 'Подписка на месяц', amount: 10 }],
    subscription_period: 2592000
  };

  try {
    const tgResponse = await fetch(`https://api.telegram.org/bot${token}/createInvoiceLink`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await tgResponse.json();
    if (!tgResponse.ok || !result.ok) {
      return { statusCode: 502, body: JSON.stringify({ error: result.description || 'Telegram не создал счёт' }) };
    }
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      body: JSON.stringify({ invoiceLink: result.result })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Ошибка соединения с Telegram' }) };
  }
};
