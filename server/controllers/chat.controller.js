import chatService from '../services/chat.service.js';
import { APP_CONSTANTS } from '../common/constants/app.constant.js';
const { MESSAGES } = APP_CONSTANTS;

class ChatController {
  async askQuestion(req, res) {
    try {
      const { question } = req.body;
      const userId = req.user ? req.user.userId : null;

      const answer = await chatService.askQuestion(userId, question);
      
      res.status(200).json({ answer });
    } catch (error) {
      console.error('Lỗi RAG Chatbot:', error);
      res.status(error.status || 500).json({ 
        message: error.message || MESSAGES.CHAT.RAG_ERROR 
      });
    }
  }
}

export default new ChatController();
