import express from 'express';
const router = express.Router();
import jobsController from '../controllers/jobs.controller.js';
import optionalAuth from '../middleware/optionalAuth.middleware.js';

router.post('/process', optionalAuth, jobsController.processJob);
router.get('/:jobId/progress', jobsController.streamProgress);

export default router;
