import express from 'express';
const router = express.Router();
import historyController from '../controllers/history.controller.js';
import auth from '../middleware/auth.middleware.js';

router.post('/', auth, historyController.saveHistory);
router.get('/', auth, historyController.getHistories);
router.delete('/:id', auth, historyController.deleteHistory);

export default router;
