import express from 'express';
import authController from '../controllers/auth.controller.js';
import auth from '../middleware/auth.middleware.js';
import { heavyLimiter } from '../middleware/rateLimiter.middleware.js';

const router = express.Router();

router.post('/register', heavyLimiter, authController.register);
router.post('/login', heavyLimiter, authController.login);
router.post('/logout', authController.logout);
router.get('/me', auth, authController.getMe);

export default router;
