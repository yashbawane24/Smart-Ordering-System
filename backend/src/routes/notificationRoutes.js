import express from 'express';
import { getMyNotifications, markRead, markAllRead } from '../controllers/notificationController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getMyNotifications);
router.patch('/:id/read', markRead);
router.patch('/read-all', markAllRead);

export default router;
