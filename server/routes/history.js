const express = require('express');
const router = express.Router();
const historyController = require('../controllers/history.controller');
const auth = require('../middleware/auth');

// @route   POST /api/history
// @desc    Lưu lịch sử mới
// @access  Private
router.post('/', auth, historyController.saveHistory);

// @route   GET /api/history
// @desc    Lấy danh sách lịch sử của User
// @access  Private
router.get('/', auth, historyController.getHistories);

// @route   DELETE /api/history/:id
// @desc    Xóa một mục lịch sử
// @access  Private
router.delete('/:id', auth, historyController.deleteHistory);

module.exports = router;
