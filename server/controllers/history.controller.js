import historyService from '../services/history.service.js';
import { APP_CONSTANTS } from '../common/constants/app.constant.js';
const { MESSAGES } = APP_CONSTANTS;

class HistoryController {
  async saveHistory(req, res) {
    try {
      const { contentHtml } = req.body;
      const history = await historyService.saveHistory(req.user.userId, contentHtml);
      res.status(201).json(history);
    } catch (error) {
      console.error('Lỗi khi lưu lịch sử:', error);
      res.status(500).json({ message: MESSAGES.HISTORY.SAVE_ERROR });
    }
  }

  async getHistories(req, res) {
    try {
      const histories = await historyService.getHistoriesByUser(req.user.userId);
      res.json(histories);
    } catch (error) {
      console.error('Lỗi khi tải lịch sử:', error);
      res.status(500).json({ message: MESSAGES.HISTORY.LOAD_ERROR });
    }
  }

  async deleteHistory(req, res) {
    try {
      await historyService.deleteHistory(req.params.id, req.user.userId);
      res.json({ message: MESSAGES.HISTORY.DELETE_SUCCESS });
    } catch (error) {
      if (error.status) {
        return res.status(error.status).json({ message: error.message });
      }
      console.error('Lỗi khi xóa lịch sử:', error);
      res.status(500).json({ message: MESSAGES.HISTORY.DELETE_ERROR });
    }
  }
}

export default new HistoryController();
