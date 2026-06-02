

class TelegramService {
  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN;
    this.chatId = process.env.TELEGRAM_CHAT_ID;
  }

  async sendFeedback(message) {
    if (!this.botToken || !this.chatId) {
      console.warn('Telegram Bot Token hoặc Chat ID chưa được cấu hình.');
      return false;
    }

    try {
      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
      const text = `🚨 *BÁO LỖI MỚI (Clean Text)*\n\nNội dung:\n\`\`\`\n${message}\n\`\`\`\n\n🕒 Thời gian: ${new Date().toLocaleString('vi-VN')}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: text,
          parse_mode: 'Markdown'
        })
      });

      if (!response.ok) {
        console.error('Lỗi khi gửi tin nhắn Telegram:', await response.text());
        return false;
      }

      return true;
    } catch (error) {
      console.error('Lỗi Exception khi gửi Telegram:', error);
      return false;
    }
  }
}

module.exports = new TelegramService();
