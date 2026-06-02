const historyService = require('../services/history.service');

class HistoryController {
  async saveHistory(req, res) {
    try {
      const { contentHtml } = req.body;
      const history = await historyService.saveHistory(req.user.userId, contentHtml);
      res.status(201).json(history);
    } catch (error) {
      console.error('Lỗi khi lưu lịch sử:', error);
      res.status(500).json({ message: 'Lỗi server khi lưu lịch sử' });
    }
  }

  async getHistories(req, res) {
    try {
      const histories = await historyService.getHistoriesByUser(req.user.userId);
      res.json(histories);
    } catch (error) {
      console.error('Lỗi khi tải lịch sử:', error);
      res.status(500).json({ message: 'Lỗi server khi tải lịch sử' });
    }
  }

  async deleteHistory(req, res) {
    try {
      await historyService.deleteHistory(req.params.id, req.user.userId);
      res.json({ message: 'Đã xóa lịch sử' });
    } catch (error) {
      if (error.status) {
        return res.status(error.status).json({ message: error.message });
      }
      console.error('Lỗi khi xóa lịch sử:', error);
      res.status(500).json({ message: 'Lỗi server khi xóa lịch sử' });
    }
  }
}

module.exports = new HistoryController();
