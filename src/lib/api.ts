export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatResponse {
  message: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// Конфигурация API
export const API_CONFIG = {
  apiKey: "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",      // <-- СЮДА ВСТАВИТЬ ТОКЕН
  baseUrl: "https://openrouter.ai/api/v1",
  model: "deepseek/deepseek-chat-v3-0324:free",
  maxTokens: 1000,
  temperature: 0.7,
  referer: "https://dcoreaichat.netlify.app", // <-- ВСТАВЬ ТВОЙ ДОМЕН БЕЗ СЛЕША В КОНЦЕ
};

export class AIService {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || API_CONFIG.apiKey;
    this.baseUrl = API_CONFIG.baseUrl;
  }

  async sendMessage(
    messages: ChatMessage[],
    systemPrompt?: string
  ): Promise<ChatResponse> {
    if (!this.apiKey || this.apiKey === "your-api-key-here") {
      return this.getMockResponse(messages[messages.length - 1].content, systemPrompt);
    }

    try {
      const body = {
        model: API_CONFIG.model,
        messages: systemPrompt
          ? [{ role: "system", content: systemPrompt }, ...messages]
          : messages,
        max_tokens: API_CONFIG.maxTokens,
        temperature: API_CONFIG.temperature,
      };

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`,
          "HTTP-Referer": API_CONFIG.referer, // Обязательно!
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${errorText}`);
      }

      const data = await response.json();

      return {
        message: data.choices?.[0]?.message?.content || "Извините, произошла ошибка.",
        usage: {
          promptTokens: data.usage?.prompt_tokens || 0,
          completionTokens: data.usage?.completion_tokens || 0,
          totalTokens: data.usage?.total_tokens || 0,
        },
      };
    } catch (error) {
      console.error("AI API Error:", error);
      return this.getMockResponse(messages[messages.length - 1].content, systemPrompt);
    }
  }

  // ... (mock и остальные методы не меняй)
  private getMockResponse(userMessage: string, systemPrompt?: string): ChatResponse {
    const mockResponses = [
      "Это демо-ответ от AI. Для полноценной работы добавьте ваш API ключ в конфигурацию.",
      "Спасибо за ваше сообщение! Когда вы настроите API ключ, я смогу давать более развернутые ответы.",
      "Интересный вопрос! После настройки API я смогу обрабатывать ваши запросы с помощью реального искусственного интеллекта.",
      "Я понимаю ваш запрос. Добавьте API ключ для получения полноценных ответов от AI.",
    ];
    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    let response = randomResponse;
    if (systemPrompt) {
      response = `${response}\n\n(Активная роль: ${systemPrompt.split('.')[0]})`;
    }
    return {
      message: response,
      usage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
      },
    };
  }
}

export const aiService = new AIService();
