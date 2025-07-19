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

    console.log("Запрос к OpenRouter:", JSON.stringify(reqBody));
    console.log("Отправляю с ключом:", OPENROUTER_API_KEY.slice(0,10) + "...");

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": REFERER // вместо "Referer"
      },
      body: JSON.stringify(reqBody)
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
