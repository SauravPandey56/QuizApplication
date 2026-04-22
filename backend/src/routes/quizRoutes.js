import express from 'express';
import { 
  createQuiz, getQuizzes, getQuizById, updateQuiz, 
  requestUpdatePermission, handleUpdatePermission, 
  submitForReview, approveQuiz, scheduleQuiz, postponeQuiz, deleteQuiz,
  pauseExam, extendTime, sendBroadcast, forceSubmit
} from '../controllers/quizController.js';
import { protect, authorize } from '../middleware/auth.js';
import questionRoutes from './questionRoutes.js';

const router = express.Router();

router.use('/:quizId/questions', questionRoutes);

router.route('/')
  .get(protect, getQuizzes)
  .post(protect, authorize('examiner', 'admin'), createQuiz);

router.route('/:id')
  .get(getQuizById)
  .put(protect, authorize('examiner', 'admin'), updateQuiz)
  .delete(protect, authorize('admin'), deleteQuiz);

// Lifecycle states
router.put('/:id/submit-review', protect, authorize('examiner'), submitForReview);
router.put('/:id/approve', protect, authorize('admin'), approveQuiz);
router.put('/:id/schedule', protect, authorize('admin', 'examiner'), scheduleQuiz);
router.put('/:id/postpone', protect, authorize('admin'), postponeQuiz);

// Admin controls
router.put('/:id/pause', protect, authorize('admin'), pauseExam);
router.put('/:id/extend', protect, authorize('admin'), extendTime);
router.put('/:id/broadcast', protect, authorize('admin'), sendBroadcast);
router.put('/:id/force-submit', protect, authorize('admin'), forceSubmit);

router.post('/:id/request-update', protect, authorize('examiner'), requestUpdatePermission);
router.post('/:id/handle-permission', protect, authorize('admin'), handleUpdatePermission);

export default router;
