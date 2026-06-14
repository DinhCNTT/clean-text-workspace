import telegramService from '../services/telegram.service.js';
import { APP_CONSTANTS } from '../common/constants/app.constant.js';
const { MESSAGES } = APP_CONSTANTS;

class FeedbackController {
  async submitFeedback(req, res) {
    try {
      const { message } = req.body;

      if (!message || message.trim().length === 0) {
        return res.status(400).json({ message: MESSAGES.FEEDBACK.MISSING_MESSAGE });
      }

      // Gửi sang Telegram
      const isSent = await telegramService.sendFeedback(message);

      if (isSent) {
        return res.status(200).json({ message: MESSAGES.FEEDBACK.SUCCESS });
      } else {
        return res.status(500).json({ message: MESSAGES.FEEDBACK.ERROR });
      }
    } catch (error) {
      console.error('Lỗi FeedbackController:', error);
      res.status(500).json({ message: MESSAGES.SERVER.INTERNAL_ERROR });
    }
  }
}

export default new FeedbackController();
