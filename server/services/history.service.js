import History from '../models/history.model.js';
import { APP_CONSTANTS } from '../common/constants/app.constant.js';
const { MESSAGES } = APP_CONSTANTS;

class HistoryService {
  async saveHistory(userId, contentHtml) {
    const history = new History({ userId, contentHtml });
    await history.save();
    return history;
  }

  async getHistoriesByUser(userId) {
    return await History.find({ userId }).sort({ createdAt: -1 });
  }

  async deleteHistory(historyId, userId) {
    const history = await History.findOne({ _id: historyId, userId });
    if (!history) {
      throw Object.assign(new Error('Không tìm thấy lịch sử'), { status: 404 });
    }
    await History.findByIdAndDelete(historyId);
    return true;
  }
}

export default new HistoryService();
