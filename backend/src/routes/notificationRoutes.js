import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getNotifications, markAllAsRead } from '../controllers/notificationController.js';

const router = express.Router();

router.route('/')
  .get(protect, getNotifications);

router.route('/read-all')
  .put(protect, markAllAsRead);

export default router;
