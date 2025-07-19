const { default: fetch } = await import('node-fetch');


// !! СЮДА ВСТАВЬ СВОЙ OPENROUTER КЛЮЧ !!
const OPENROUTER_API_KEY = "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";
const REFERER = "https://dcoreaichat.netlify.app"; // ТВОЙ домен

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const reqBody = JSON.parse(event.body);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": REFERER
      },
      body: JSON.stringify(reqBody)
    });

    const data = await response.json();
    return {
      statusCode: response.status,
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
