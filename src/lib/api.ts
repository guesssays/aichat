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

export const API_CONFIG = {
  model: "deepseek/deepseek-chat-v3-0324:free",
  maxTokens: 1000,
  temperature: 0.7,
};

export class AIService {
  async sendMessage(
    messages: ChatMessage[],
    systemPrompt?: string
  ): Promise<ChatResponse> {
    try {
      const body = {
        model: API_CONFIG.model,
        messages: systemPrompt
          ? [{ role: "system", content: systemPrompt }, ...messages]
          : messages,
        max_tokens: API_CONFIG.maxTokens,
        temperature: API_CONFIG.temperature,
      };

      const response = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
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

  private getMockResponse(userMessage: string, systemPrompt?: string): ChatResponse {
    const mockResponses = [
      "Это демо-ответ от AI. Для полноценной работы добавьте серверную функцию.",
      "Спасибо за ваше сообщение! Когда вы настроите серверную функцию, я смогу давать развернутые ответы.",
      "Интересный вопрос! После настройки API я смогу обрабатывать ваши запросы с помощью реального искусственного интеллекта.",
      "Я понимаю ваш запрос. Настройте серверную функцию для получения ответов от AI.",
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
