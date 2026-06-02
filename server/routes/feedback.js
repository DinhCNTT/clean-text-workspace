const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback.controller');

// POST /api/feedback - Nhận góp ý và báo lỗi (Public API, không cần auth)
router.post('/', feedbackController.submitFeedback);

module.exports = router;
