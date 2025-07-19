let fetch;

exports.handler = async function(event) {
  if (!fetch) {
    fetch = (await import('node-fetch')).default;
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const OPENROUTER_API_KEY = "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";
  const REFERER = "https://dcoreaichat.netlify.app"; // Ваш домен без слеша

  try {
    const reqBody = JSON.parse(event.body);

    // Формируем тело запроса с нужной моделью и параметрами
    const requestBody = {
      model: "deepseek/deepseek-r1-0528:free",
      messages: reqBody.messages,
      max_tokens: 1000,
      temperature: 0.7
    };

    console.log("Запрос к OpenRouter:", JSON.stringify(requestBody));
    console.log("Отправляю с ключом:", OPENROUTER_API_KEY.slice(0,10) + "...");

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      // "HTTP-Referer": REFERER // вместо "Referer"
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      body: JSON.stringify(data)
    };
  } catch (err) {
    console.error("Ошибка в функции chat:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
