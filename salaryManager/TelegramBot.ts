// telegramBot.ts

import fetch from "node-fetch";

export interface TelegramBotConfig {
  botToken: string;
  chatId: string;
  useProxy?: boolean; // Добавляем флаг включения прокси
}

interface TelegramApiResponse {
  ok: boolean;
  description?: string;
}

export class TelegramBot {
  private botToken: string;
  private chatId: string;
  private apiUrl: string;

  constructor(config: TelegramBotConfig) {
    this.botToken = config.botToken;
    this.chatId = config.chatId;

    // Если флагuseProxy равен true, отправляем запросы на локальный мост, иначе напрямую в Telegram
    const baseUrl = config.useProxy
      ? "http://127.0.0.1:1443"
      : "https://telegram.org";

    this.apiUrl = `${baseUrl}/bot${this.botToken}/sendMessage`;
  }

  async sendMessage(message: string): Promise<void> {
    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: message,
        }),
      });

      const data = (await response.json()) as TelegramApiResponse;
      if (!data.ok) {
        throw new Error(
          `Telegram API error: ${data.description ?? "unknown error"}`,
        );
      }
    } catch (error) {
      console.error("Failed to send message to Telegram:", error);
      throw error;
    }
  }
}
