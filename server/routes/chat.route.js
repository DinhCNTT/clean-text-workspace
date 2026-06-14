import express from 'express';
import chatController from '../controllers/chat.controller.js';
import optionalAuth from '../middleware/optionalAuth.middleware.js';
import { heavyLimiter } from '../middleware/rateLimiter.middleware.js';

const router = express.Router();

router.post('/', optionalAuth, heavyLimiter, chatController.askQuestion);

export default router;
