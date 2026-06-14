import express from 'express';
const router = express.Router();
import feedbackController from '../controllers/feedback.controller.js';

router.post('/', feedbackController.submitFeedback);

export default router;
