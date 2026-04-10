import express from 'express';
import { submitFeedback, getFeedbacks, markAsRead, deleteFeedback } from '../controllers/feedbackController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public route for submitting feedback
router.post('/', submitFeedback);

// Admin-only routes for viewing existing feedbacks
router.route('/')
  .get(protect, authorize('admin'), getFeedbacks);

router.route('/:id/read')
  .put(protect, authorize('admin'), markAsRead);

router.route('/:id')
  .delete(protect, authorize('admin'), deleteFeedback);

export default router;
