// API утилиты для работы с AI (OpenAI/другие провайдеры)

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
  baseUrl: "https://openrouter.ai/api/v1", // <-- Адрес OpenRouter
  model: "deepseek/deepseek-chat-v3-0324:free", // <-- твоя модель
  maxTokens: 1000,
  temperature: 0.7,
};


export class AIService {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || API_CONFIG.apiKey;
    this.baseUrl = API_CONFIG.baseUrl;
  }

  /**
   * Отправка сообщения в AI и получение ответа
   */
  async sendMessage(
    messages: ChatMessage[],
    systemPrompt?: string
  ): Promise<ChatResponse> {
    // Проверяем наличие API ключа
    if (!this.apiKey || this.apiKey === "your-api-key-here") {
      // Возвращаем заглушку, если API ключ не настроен
      return this.getMockResponse(messages[messages.length - 1].content, systemPrompt);
    }

    try {
      const requestBody = {
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
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();

      return {
        message: data.choices[0]?.message?.content || "Извините, произошла ошибка.",
        usage: {
          promptTokens: data.usage?.prompt_tokens || 0,
          completionTokens: data.usage?.completion_tokens || 0,
          totalTokens: data.usage?.total_tokens || 0,
        },
      };
    } catch (error) {
      console.error("AI API Error:", error);
      // В случае ошибки возвращаем заглушку
      return this.getMockResponse(messages[messages.length - 1].content, systemPrompt);
    }
  }

  /**
   * Заглушка для демонстрации работы без API ключа
   */
  private getMockResponse(userMessage: string, systemPrompt?: string): ChatResponse {
    const mockResponses = [
      "Это демо-ответ от AI. Для полноценной работы добавьте ваш API ключ в конфигурацию.",
      "Спасибо за ваше сообщение! Когда вы настроите API ключ, я смогу давать более развернутые ответы.",
      "Интересный вопрос! После настройки API я смогу обрабатывать ваши запросы с помощью реального искусственного интеллекта.",
      "Я понимаю ваш запрос. Добавьте API ключ для получения полноценных ответов от AI.",
    ];

    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

    // Добавляем контекст роли, если есть системный промпт
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

  /**
   * Проверка валидности API ключа
   */
  async testApiKey(): Promise<boolean> {
    if (!this.apiKey || this.apiKey === "your-api-key-here") {
      return false;
    }

    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Получение списка доступных моделей
   */
  async getAvailableModels(): Promise<string[]> {
    if (!this.apiKey || this.apiKey === "your-api-key-here") {
      return ["gpt-3.5-turbo", "gpt-4"];
    }

    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch models");
      }

      const data = await response.json();
      return data.data
        .filter((model: { id: string }) => model.id.includes("gpt"))
        .map((model: { id: string }) => model.id);
    } catch {
      return ["gpt-3.5-turbo", "gpt-4"];
    }
  }
}

// Экспортируем экземпляр сервиса
export const aiService = new AIService();

// Утилитные функции
export const formatTokenUsage = (usage: { promptTokens: number; completionTokens: number; totalTokens: number }) => {
  return `Tokens: ${usage.totalTokens} (${usage.promptTokens} + ${usage.completionTokens})`;
};

export const estimateCost = (totalTokens: number, model: string = "gpt-3.5-turbo") => {
  // Примерные цены за 1K токенов (на июль 2024)
  const prices = {
    "gpt-3.5-turbo": 0.002,
    "gpt-4": 0.06,
    "gpt-4-turbo": 0.03,
  };

  const pricePerK = prices[model as keyof typeof prices] || prices["gpt-3.5-turbo"];
  return ((totalTokens / 1000) * pricePerK).toFixed(4);
};
