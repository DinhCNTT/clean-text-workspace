import { generateEmbedding, askQuestionWithContext } from './ai.service.js';
import { querySimilarContext } from './vectorDb.service.js';
import { APP_CONSTANTS } from '../common/constants/app.constant.js';
const { MESSAGES } = APP_CONSTANTS;

class ChatService {
  async askQuestion(userId, question) {
    if (!question || !question.trim()) {
      const err = new Error(MESSAGES.CHAT.MISSING_QUESTION);
      err.status = 400;
      throw err;
    }

    if (!process.env.PINECONE_API_KEY || (!process.env.OPENAI_API_KEY && !process.env.GEMINI_API_KEY)) {
      const err = new Error(MESSAGES.CHAT.AI_NOT_CONFIGURED);
      err.status = 503;
      throw err;
    }

    // 1. Tạo vector embedding cho câu hỏi của user
    const questionEmbedding = await generateEmbedding(question);

    // 2. Tìm kiếm ngữ cảnh tương đồng từ Pinecone của user này
    const context = await querySimilarContext(userId, questionEmbedding);
    console.log('🔍 Ngữ cảnh tìm thấy từ Pinecone gửi sang AI:', context);

    if (!context || context.trim() === '') {
      return MESSAGES.CHAT.NO_CONTEXT_FOUND;
    }

    // 3. Sử dụng mô hình AI để trả lời với ngữ cảnh
    const answer = await askQuestionWithContext(context, question);
    return answer;
  }
}

export default new ChatService();
