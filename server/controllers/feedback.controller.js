const telegramService = require('../services/telegram.service');

class FeedbackController {
  async submitFeedback(req, res) {
    try {
      const { message } = req.body;

      if (!message || message.trim().length === 0) {
        return res.status(400).json({ message: 'Nội dung góp ý không được để trống.' });
      }

      // Gửi sang Telegram
      const isSent = await telegramService.sendFeedback(message);

      if (isSent) {
        return res.status(200).json({ message: 'Gửi góp ý thành công!' });
      } else {
        return res.status(500).json({ message: 'Có lỗi xảy ra khi gửi báo lỗi.' });
      }
    } catch (error) {
      console.error('Lỗi FeedbackController:', error);
      res.status(500).json({ message: 'Lỗi server nội bộ' });
    }
  }
}

module.exports = new FeedbackController();
