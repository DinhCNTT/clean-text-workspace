import express from 'express';

import authRoutes from './auth.route.js';
import historyRoutes from './history.route.js';
import feedbackRoutes from './feedback.route.js';
import jobsRoutes from './jobs.route.js';
import chatRoutes from './chat.route.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/history', historyRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/jobs', jobsRoutes);
router.use('/chat', chatRoutes);

export default router;
