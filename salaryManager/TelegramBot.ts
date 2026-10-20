import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

interface TelegramApiResponse {
  ok: boolean;
  description?: string;
}

export class TelegramBot {
  private botToken: string;
  private apiUrl: string;
  private chatId: string;

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || "";
    this.chatId = process.env.TELEGRAM_CHAT_ID || "";
    this.apiUrl = `${process.env.TELEGRAM_API_BASE_URL || "https://api.telegram.org"}/bot${this.botToken}/sendMessage`;

    if (process.env.TELEGRAM_MTPROTO_PROXY) {
      console.warn(
        "[TelegramBot] TELEGRAM_MTPROTO_PROXY is ignored: Telegram Bot API does not support MTProto proxies.",
      );
    }
  }

  async sendMessage(message: string, chatId = this.chatId): Promise<void> {
    if (!this.botToken) {
      throw new Error(
        "TelegramBot error: TELEGRAM_BOT_TOKEN is missing in .env",
      );
    }
    if (!chatId) {
      throw new Error(
        "TelegramBot error: TELEGRAM_CHAT_ID is missing in .env",
      );
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => "Unreadable");
        throw new Error(
          `Telegram API responded with status ${response.status}: ${errText}`,
        );
      }

      const data = (await response.json()) as TelegramApiResponse;
      if (!data.ok) {
        throw new Error(`Telegram API error: ${data.description ?? "unknown"}`);
      }

      console.log(`[TelegramBot] Message successfully sent to chat: ${chatId}`);
    } catch (error: any) {
      console.error("[TelegramBot Error]:", error.message || error);
      throw error;
    }
  }
}
