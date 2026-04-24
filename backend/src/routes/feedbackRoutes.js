import express from 'express';
import { submitFeedback, getFeedbacks, markAsRead, deleteFeedback, getUnreadFeedbackCount } from '../controllers/feedbackController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public route for submitting feedback
router.post('/feedback', submitFeedback);

// Admin-only routes for viewing existing feedbacks
router.route('/feedback')
  .get(protect, authorize('admin'), getFeedbacks);

router.route('/feedback/unread-count')
  .get(protect, authorize('admin'), getUnreadFeedbackCount);

router.route('/feedback/:id/read')
  .put(protect, authorize('admin'), markAsRead);

router.route('/feedback/:id')
  .delete(protect, authorize('admin'), deleteFeedback);

export default router;
