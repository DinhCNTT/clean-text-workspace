const History = require('../models/History');

class HistoryService {
  async getHistoriesByUser(userId) {
    return await History.find({ user: userId }).sort({ createdAt: -1 });
  }

  async saveHistory(userId, contentHtml) {
    // Lấy một phần text từ HTML làm title (khoảng 30 ký tự đầu tiên)
    const plainText = contentHtml.replace(/<[^>]+>/g, '').trim();
    let title = plainText.substring(0, 30);
    if (plainText.length > 30) title += '...';
    if (!title) title = 'Văn bản trống';

    const history = new History({
      user: userId,
      title,
      contentHtml
    });

    await history.save();
    return history;
  }

  async deleteHistory(historyId, userId) {
    const history = await History.findById(historyId);
    
    if (!history) {
      throw Object.assign(new Error('Không tìm thấy mục lịch sử'), { status: 404 });
    }

    // Đảm bảo user chỉ được xóa lịch sử của chính họ
    if (history.user.toString() !== userId) {
      throw Object.assign(new Error('Không có quyền thực hiện'), { status: 403 });
    }

    await history.deleteOne();
    return true;
  }
}

module.exports = new HistoryService();
